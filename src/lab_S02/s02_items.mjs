// DevLeague AWS Developer · Session 2 lab, Part 4: DynamoDB items, Query, Scan, a GSI and conditional writes.
// Run: node s02_items.mjs            (table AWSDevFiles, made in Part 1)
// Safe to run more than once: step 1 puts the same nine items back.
// Every call asks for ReturnConsumedCapacity so you can see what it cost. Write the R lines on your worksheet.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const TableName = process.env.TABLE ?? "AWSDevFiles";
// The document client turns plain JavaScript values into DynamoDB's typed format ({ S: "..." }, { N: "..." }) and back.
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const cap = (r) => r.ConsumedCapacity?.CapacityUnits ?? "n/a";
const now = Math.floor(Date.now() / 1000);                       // TTL wants a Number: epoch seconds
const day = 86400;

// 1. Nine uploads by three inspectors. Partition key ownerId, sort key uploadedAt (ISO 8601 sorts as text).
const owners = { "insp-0142": ["2026-11-03", "2026-11-12", "2026-11-19", "2026-11-24"], "insp-0207": ["2026-11-05", "2026-11-21"], "insp-0388": ["2026-11-09", "2026-11-17", "2026-11-23"] };
let wcu = 0, n = 0;
for (const [ownerId, dates] of Object.entries(owners)) {
  for (const d of dates) {
    n++;
    const item = {
      ownerId, uploadedAt: `${d}T15:00:00Z`, fileKey: `uploads/${ownerId}/photo-${n}.jpg`,
      sizeBytes: 250000 + n * 1000, status: "RECEIVED", version: 1,
      expiresAt: n === 1 ? now - day : now + 7 * day,                // item 1 has already expired
    };
    const r = await db.send(new PutCommand({ TableName, Item: item, ReturnConsumedCapacity: "TOTAL" }));
    wcu += r.ConsumedCapacity?.CapacityUnits ?? 0;
  }
}
console.log(`R1  Put ${n} items, ${wcu} write capacity units in total (each item is under 1 KB)`);

// 2. Query: one inspector's uploads, newest first. Needs the partition key; reads only that item collection.
let r = await db.send(new QueryCommand({
  TableName, KeyConditionExpression: "ownerId = :o", ExpressionAttributeValues: { ":o": "insp-0142" },
  ScanIndexForward: false, ReturnConsumedCapacity: "TOTAL",
}));
console.log(`R2  Query insp-0142: Count ${r.Count}, newest ${r.Items[0]?.uploadedAt}, capacity ${cap(r)} RCU`);

// 3. Query with a sort key condition: the same inspector, only Nov 10 to Nov 20.
r = await db.send(new QueryCommand({
  TableName, KeyConditionExpression: "ownerId = :o AND uploadedAt BETWEEN :a AND :b",
  ExpressionAttributeValues: { ":o": "insp-0142", ":a": "2026-11-10", ":b": "2026-11-20T23:59:59Z" },
  ReturnConsumedCapacity: "TOTAL",
}));
console.log(`R3  Query insp-0142, Nov 10-20: Count ${r.Count} (${r.Items.map((i) => i.uploadedAt.slice(0, 10)).join(", ")})`);

// 4. Scan with a filter: reads every item in the table, then throws away the ones that don't match.
r = await db.send(new ScanCommand({
  TableName, FilterExpression: "ownerId = :o", ExpressionAttributeValues: { ":o": "insp-0207" },
  ReturnConsumedCapacity: "TOTAL",
}));
console.log(`R4  Scan filtered to insp-0207: ScannedCount ${r.ScannedCount}, Count ${r.Count}, capacity ${cap(r)} RCU`);

// 5. The GSI: find an upload by its S3 object key. Write a new item, then query the index at once.
const fresh = { ownerId: "insp-0207", uploadedAt: new Date().toISOString(), fileKey: `uploads/insp-0207/fresh-${now}.jpg`, sizeBytes: 1000, status: "RECEIVED", version: 1, expiresAt: now + day };
await db.send(new PutCommand({ TableName, Item: fresh }));
r = await db.send(new QueryCommand({
  TableName, IndexName: "fileKey-index", KeyConditionExpression: "fileKey = :k", ExpressionAttributeValues: { ":k": fresh.fileKey },
}));
console.log(`R5  GSI query right after the write: Count ${r.Count} (0 means the index hadn't caught up yet; run again and it's usually 1)`);
try {
  await db.send(new QueryCommand({
    TableName, IndexName: "fileKey-index", KeyConditionExpression: "fileKey = :k", ExpressionAttributeValues: { ":k": fresh.fileKey },
    ConsistentRead: true,
  }));
  console.log("R6  GSI with ConsistentRead: accepted (unexpected)");
} catch (e) {
  console.log(`R6  GSI with ConsistentRead: ${e.name}: ${e.message}`);
}

// 6. The base table can do a strongly consistent read, at twice the cost of an eventually consistent one.
const key = { ownerId: "insp-0142", uploadedAt: "2026-11-24T15:00:00Z" };
const ev = await db.send(new GetCommand({ TableName, Key: key, ReturnConsumedCapacity: "TOTAL" }));
const st = await db.send(new GetCommand({ TableName, Key: key, ConsistentRead: true, ReturnConsumedCapacity: "TOTAL" }));
console.log(`R7  GetItem eventually consistent ${cap(ev)} RCU, strongly consistent ${cap(st)} RCU`);

// 7. Conditional write: create only if no item has this key yet.
try {
  await db.send(new PutCommand({ TableName, Item: { ...key, fileKey: "uploads/insp-0142/duplicate.jpg" }, ConditionExpression: "attribute_not_exists(ownerId)" }));
  console.log("R8  Conditional put: written (unexpected, the key already exists)");
} catch (e) {
  console.log(`R8  Conditional put on an existing key: ${e.name}`);
}

// 8. Optimistic locking: update only if the version is still the one we read.
const read = (await db.send(new GetCommand({ TableName, Key: key, ConsistentRead: true }))).Item;
const bump = (expected) => db.send(new UpdateCommand({
  TableName, Key: key, UpdateExpression: "SET #s = :s, version = version + :one",
  ConditionExpression: "version = :v", ExpressionAttributeNames: { "#s": "status" },
  ExpressionAttributeValues: { ":s": "REVIEWED", ":one": 1, ":v": expected }, ReturnValues: "UPDATED_NEW",
}));
const ok = await bump(read.version);
console.log(`R9  Update with version ${read.version}: now version ${ok.Attributes.version}`);
try {
  await bump(read.version);                                        // a second writer still holding the old version
  console.log("R10 Stale update: written (unexpected)");
} catch (e) {
  console.log(`R10 Stale update with version ${read.version}: ${e.name} (re-read the item, then try again)`);
}

// 9. TTL: item 1 expired yesterday, but TTL deletes in the background, typically within a few days.
r = await db.send(new GetCommand({ TableName, Key: { ownerId: "insp-0142", uploadedAt: "2026-11-03T15:00:00Z" } }));
console.log(`R11 Expired item still readable: ${r.Item ? "yes" : "no"} (expiresAt ${r.Item?.expiresAt}, now ${now}). Filter with expiresAt > now.`);

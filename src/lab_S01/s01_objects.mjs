// DevLeague AWS Developer · Session 1 lab, Part 2: the SDK for JavaScript v3 on S3.
// Puts five small objects, reads one back, then lists them two at a time with a paginator.
// Run: node s01_objects.mjs YOUR-BUCKET-NAME
//      FULL_LOG=1 node s01_objects.mjs YOUR-BUCKET-NAME     (unfiltered logger: console)
import {
  S3Client, PutObjectCommand, GetObjectCommand, paginateListObjectsV2,
} from "@aws-sdk/client-s3";

const bucket = process.argv[2];
if (!bucket) { console.error("Usage: node s01_objects.mjs YOUR-BUCKET-NAME"); process.exit(1); }

// logger: console prints everything the SDK reports, including each step of the credential
// provider chain. The filtered version keeps the chain steps and one line per call.
const filtered = {
  debug: (...a) => { const s = a.join(" "); if (/defaultProvider::|remoteProvider::/.test(s)) console.log("[chain]", s.replace("@aws-sdk/credential-provider-node - ", "")); },
  info: (o) => console.log(`[call]  ${o.commandName}  attempts=${o.metadata?.attempts}  HTTP ${o.metadata?.httpStatusCode}`),
  warn: console.warn, error: (o) => console.error("[error]", o?.commandName ?? "", o?.error?.name ?? o),
  trace: () => {},
};

const s3 = new S3Client({ logger: process.env.FULL_LOG ? console : filtered }); // Region comes from AWS_REGION

// 1. Put five objects. Body is a string here; the SDK sends it as the HTTP request body.
for (let i = 1; i <= 5; i++) {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `orders/order-${i}.json`,
    Body: JSON.stringify({ orderId: i, item: "coffee", qty: i }),  // serialize the object to JSON text
    ContentType: "application/json",
  }));
}
console.log("Put 5 objects under orders/");

// 2. Get one back. In SDK v3 the Body is a stream; transformToString() reads it all.
const got = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: "orders/order-3.json" }));
const text = await got.Body.transformToString();
const order = JSON.parse(text);                                         // deserialize back to an object
console.log("Got order-3.json:", order, "ContentType:", got.ContentType);

// 3. List with a paginator, 2 keys per page, so you can see the pages.
let page = 0;
for await (const p of paginateListObjectsV2({ client: s3, pageSize: 2 }, { Bucket: bucket, Prefix: "orders/" })) {
  page++;
  console.log(`Page ${page}:`, (p.Contents ?? []).map((o) => o.Key).join(", "),
    p.IsTruncated ? "(more pages)" : "(last page)");
}
console.log(`Done: ${page} pages. Without the paginator you would loop on NextContinuationToken yourself.`);

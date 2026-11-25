# AWS Developer Session 2: Lab Debrief Key

*Instructor and TA only. 20 minutes in the main room after the lab. Call on groups, not individuals, and ask each group which trap they avoided.*

## Expected Lab Readings (Part A)

| Reading | Expected |
|---|---|
| Table, index, billing mode | ACTIVE, ACTIVE, PAY_PER_REQUEST (on-demand). An index created with the table is usually ACTIVE when the waiter returns. If a student sees CREATING, the waiter returned for the table only: wait a minute and run describe-table again. |
| Versions and markers | 2 versions (draft one, final copy) and 1 delete marker, with the marker as IsLatest true. After deleting the marker, the cp prints "final copy". |
| PUT URL | X-Amz-Expires 300. X-Amz-Security-Token present, because CloudShell signs with temporary credentials: the URL can't outlive them. The script also shows no x-amz-checksum parameters, because the client sets requestChecksumCalculation to WHEN_REQUIRED. |
| Upload status, wrong type | 200 for the correct upload. SignatureDoesNotMatch with image/jpeg, because Content-Type text/plain was signed into the URL. |
| Expired GET | AccessDenied (the message says Request has expired). Some students will run it within 60 seconds and get the file; have them wait and run it again. |
| R2, R4 | R2: Count 4, newest 2026-11-24, 0.5 RCU (four tiny items fit in one 4 KB unit, eventually consistent). R4: ScannedCount 9 or more (the fresh items from R5 add one per run), Count 2, about 0.5 RCU. On a nine-item table the Scan costs the same as the Query; the point is ScannedCount vs Count. At two million items the Scan reads all two million. [PLATFORM CHECK: exact capacity values] |
| R5, R6 | R5 is usually Count 1, sometimes 0 on the first run. R6: ValidationException, "Consistent reads are not supported on global secondary indexes". |
| R7 | 0.5 RCU eventually consistent, 1 RCU strongly consistent. [PLATFORM CHECK] |
| R8, R10 | ConditionalCheckFailedException both times. R9 shows version 2. |

Talking points:
- R1 shows 9 WCU for 9 puts: every item is under 1 KB, so each put is 1 WCU.
- R11 shows an expired item still readable. TTL deletes in the background, typically within a few days, so code filters with expiresAt greater than now.
- Ask: "Why did we need a clean-up script for the bucket?" (aws s3 rb --force deletes current versions only; old versions and delete markers keep the bucket non-empty.)
- The lifecycle rule won't do anything tonight. S3 runs lifecycle about once a day, the objects are minutes old, and by default objects under 128 KB aren't transitioned at all.

## Part B: Pick the Keys

| Pattern | Partition key | Sort key | Index |
|---|---|---|---|
| 1. Customer's tickets, newest first | customerId | purchasedAt (ISO 8601); Query with ScanIndexForward false | None |
| 2. One watch's readings between two times | watchId (device ID) | readingTime; Query with BETWEEN | None |
| 3. Order by number, and a store's orders by day | orderId | None (simple primary key) | GSI: partition key storeId, sort key orderDate |

Why not the date for pattern 2: every watch writes to today's date, so one key value takes all the writes and hits one partition's ceiling (a hot partition). A date is low cardinality.

Traps to name:
- **Pattern 3 with an LSI.** An LSI keeps the partition key orderId, so it can't group by store. It needs a GSI.
- **Pattern 3 with a Scan and a filter on storeId.** Works, reads the whole table every time.
- **Pattern 1 sorted in code.** The sort key already keeps the order; ScanIndexForward false reverses it.

## Part C: Capacity Math

| Load | Strongly consistent | Eventually consistent |
|---|---|---|
| 50 reads/sec, 6 KB | 6 KB rounds to 8 KB = 2 units; 2 × 50 = **100 RCU** | **50 RCU** |
| 120 reads/sec, 3 KB | 3 KB rounds to 4 KB = 1 unit; 1 × 120 = **120 RCU** | **60 RCU** |

Planted trap: dividing first. 6 ÷ 4 = 1.5, × 50 = 75. Ask any group that wrote 75 to say the rounding rule out loud.

## Part D: Check-First Ticket

**Answer:** the query fails with a ValidationException, because global secondary indexes support only eventually consistent reads. The index is updated from the table in the background, so a record written a moment ago can be missing for a short time. Instead, read the base table with GetItem and ConsistentRead: true, using the key she just wrote (ownerId and uploadedAt), or use the item she already has from the write; if she only has the file key, retry the index query after a short wait.

Planted trap: ConsistentRead on the GSI, which is what she tried. Second trap: "switch the table to provisioned capacity" (capacity mode has nothing to do with consistency). Session 3's function writes these records from S3 events, so this is the exact situation they'll be in.

## Breakout Notes

- **Table first.** If a group started with S3, have them run create-table now; it'll be ready by Part 4.
- **npm install** needs internet access from CloudShell. [PLATFORM CHECK: same as S01-2]
- **curl prints nothing for the 200 check:** they left out -w. The first curl command prints only the status code.
- **Expired link still works:** less than 60 seconds have passed. Also check they didn't run the get command again, which writes a fresh URL to get_url.txt.
- **Session timed out:** the BUCKET variable is gone; aws s3 ls finds the name.
- **Clean-up:** before closing the rooms, ask every group to confirm aws s3 ls no longer shows their s02 bucket, and that describe-table still finds AWSDevFiles. **Nobody deletes the table.**
- **5-minute warning** at 45 minutes. Anyone not done with Part 4 runs the clean-up now and finishes the worksheet as homework.

## Table Handed to Session 3

AWSDevFiles, on-demand, partition key ownerId (string), sort key uploadedAt (string, ISO 8601), GSI fileKey-index (partition key fileKey, projection ALL), TTL on expiresAt. Session 3's function takes ownerId from the S3 key uploads/OWNER/FILE and writes ownerId, uploadedAt, fileKey and sizeBytes. Session 3's clean-up deletes the table.

## Debrief Questions (main room)

1. Part 2: the listing was empty, but how many things were in the bucket? Who pays for them?
2. Part 3: what does X-Amz-Security-Token tell you about how long that URL could ever last?
3. R4: ScannedCount vs Count. Which one did you pay for?
4. R6: what did DynamoDB say when you asked the index for a consistent read? What's the fix in Part D?
5. Part C: who got 75? What's the rule?

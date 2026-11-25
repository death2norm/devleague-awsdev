# AWS Developer Session 2: Storing Data: S3 and DynamoDB

*Keys, lifecycle, presigned URLs, and DynamoDB tables that hold up under load*

## S3 Basics

- **Bucket** name is unique across all of AWS. **Key** = the object's whole name, slashes included. **Prefixes** only look like folders.
- No prefix rename in a general purpose bucket: copy each object, delete the original (S3 Batch Operations for long lists).
- Object up to 5 TB; one PUT up to 5 GB; multipart above about 100 MB. **Strong read-after-write** consistency.
- **Event notifications** on create or delete: Lambda, SQS, SNS, EventBridge (at least once).

## Lifecycle, Versions, Retention

- **Transition** to a cheaper class after N days; **expire** after N days. Runs in the background about daily.
- Standard-IA and One Zone-IA: 30 days in Standard first, 30-day minimum billing. Objects under 128 KB aren't transitioned by default.
- **Glacier Instant** (milliseconds), **Flexible** (expedited 1–5 min, standard 3–5 h, bulk 5–12 h; 90-day minimum), **Deep Archive** (within 12 h; 180-day minimum).
- **Versioning:** delete without a version ID = **delete marker**; delete the marker to restore. Can only be suspended, and suspending keeps every existing version.
- Versioned bucket bill growing? **NoncurrentVersionExpiration** (and **AbortIncompleteMultipartUpload**).
- **Object Lock:** governance (bypass permission can override), compliance (nobody, not even root), legal hold (no date).

## Presigned URLs

- A signed request handed to someone without credentials: one action, one object, until it expires. `getSignedUrl(client, command, { expiresIn })`, default 900 s, max 7 days (SigV4).
- Carries the **signer's permissions**. Anyone holding it can use it. **Can't outlive the signer's credentials** (temporary credentials = early expiry).
- Signed headers must match: a signed Content-Type must be sent as-is, or **SignatureDoesNotMatch**. Expired: **AccessDenied**, "Request has expired".
- SDK v3.729.0+ adds CRC32 checksums by default: presign PUTs with `requestChecksumCalculation: "WHEN_REQUIRED"`.
- **CloudFront:** private bucket + origin access control; key group. **Signed URL** = one file; **signed cookie** = many files, URLs unchanged.

## DynamoDB Keys

- Item up to 400 KB; only the primary key is required. **Simple** key = partition key; **composite** = partition + sort key.
- **GetItem** needs the whole key. **Query** = partition key `=` + optional sort key `=`, `<`, `>`, `BETWEEN`, `begins_with`.
- **High cardinality** partition keys (user, device, order IDs). Per partition: about **1,000 WCU** and **3,000 RCU**. A hot key throttles on any capacity mode; shard it (`date#0`–`date#9`).

## Capacity Math

- **1 RCU** = 1 strongly consistent read/sec up to 4 KB. Eventual = half; transactional = double.
- **1 WCU** = 1 write/sec up to 1 KB; transactional = double.
- **Round the item size up first**, then multiply, then halve or double. 9 KB strong × 40/sec = 3 × 40 = 120 RCU.
- **On-demand:** new, spiky, unpredictable. **Provisioned + auto scaling:** steady. Over capacity: ProvisionedThroughputExceededException (the SDK retries first).

## Reads, Queries, Indexes

- Default reads are **eventually consistent**. `ConsistentRead: true` works on the base table and LSIs, **never on a GSI** (ValidationException).
- Skip the read-back: `ReturnValues: "ALL_NEW"` on UpdateItem.
- **Scan** reads everything. **Filter** and **projection** expressions don't lower capacity. 1 MB per page: **LastEvaluatedKey** means more pages (Count 0 isn't the end).
- **GSI:** own keys, add any time (backfills), eventual only, up to 20. **LSI:** same partition key, **only at table creation**, strong reads OK, up to 5, 10 GB per item collection.
- Projections: KEYS_ONLY, INCLUDE, ALL. Items without the index key aren't in the index (sparse).

## Safe Writes and Changes

- **Condition expression:** `attribute_not_exists(pk)` = create only if new. Fails with **ConditionalCheckFailedException**.
- **Optimistic locking:** `SET version = version + 1` if `version = :expected`; on failure re-read, merge, retry.
- **TransactWriteItems:** up to 100 actions, 4 MB, all or nothing, 2 WCU per write; **ClientRequestToken** for idempotency.
- **TTL:** Number, Unix epoch seconds; deleted typically within a few days, free; filter expired items yourself.
- **Streams:** item changes in order, 24 hours; KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES; Lambda reads it (Session 3).

## Homework

- Session 2 quiz (12 questions, 2 choose two) and three reflections in Moodle before next session. Keep the AWSDevFiles table for Session 3.

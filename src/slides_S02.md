<!-- SLIDE 2.01 -->
:::title
## AWS Developer Session 2
### Storing Data: S3 and DynamoDB
- **Instructor:** Alfred Rezk
:::

<!-- SLIDE 2.02 -->
## Tonight: Where Your Data Lives
:::horizontal-flow
icons: folder-open, archive, link, table, gauge, shield-check
[S3 Keys: Prefixes aren't folders] ---> [Lifecycle: Classes, versions, retention] ---> [Presigned URLs: S3 and CloudFront] ---> [DynamoDB Keys: Partition and sort] ---> [Capacity: Hot keys, RCU math] ---> [Safe Writes: Conditions, TTL, Streams]
:::

<!-- SLIDE 2.03 -->
## A Presigned URL Is a Signed Call
:::stat-callout
icon: pen-line
### Signed by you, sent by them
- **Label:** Session 1 callback
- **Context:** SigV4 proves who, when and which service. A presigned URL hands that signed request to someone without credentials.
:::

<!-- SLIDE D01 -->
:::divider
### 01
## The Folder That Isn't a Folder
- **Objectives:** 1.1.5, 1.3.1
:::

<!-- SLIDE 2.04 -->
## Bucket, Key, Prefix
:::horizontal-flow
icons: database, key-round, folder-open, file-image
[Bucket: Name unique across all of AWS] ---> [Key: The object's whole name] ---> [Prefix: Shown as a folder, not real] ---> [Object: Up to 5 TB; one PUT up to 5 GB]
:::

<!-- SLIDE 2.05 -->
## Moving a Prefix
:::two-column
:left-column
### Copy, Then Delete
icon: copy
- **Key Parameter:** No prefix rename in a general purpose bucket
- **Mechanism:** Copy each object to its new key, delete the original; Batch Operations for big lists
:right-column
### The Trap
- **Planted Distractor:** One RenameObject call on the prefix
- **Why It Fails:** RenameObject is for single objects in directory buckets (Express One Zone) only
:::

<!-- SLIDE 2.06 -->
## Storage Classes and Event Notifications
:::horizontal-flow
icons: hard-drive, timer, layers, snowflake, bell
[Standard: Read often] ---> [Standard-IA: Cheaper storage, pay per read, 30-day minimum] ---> [Intelligent-Tiering: Unknown access pattern] ---> [Glacier: Archives] ---> [Notifications: Lambda, SQS, SNS, EventBridge]
:::

<!-- SLIDE 2.07 -->
## Practice: Move 40,000 Objects
:::stat-callout
icon: circle-question-mark
### Copy each, then delete
- **Label:** Answer: C
- **Context:** A prefix is part of each key. Use S3 Batch Operations for a long list.
:::

<!-- SLIDE D02 -->
:::divider
### 02
## Seven Years of Inspection Reports
- **Objectives:** 1.3.1
:::

<!-- SLIDE 2.08 -->
## A Lifecycle Rule for Reports
:::horizontal-flow
icons: file-text, hard-drive, snowflake, trash
[Day 0: S3 Standard] ---> [Day 30: Standard-IA (30-day minimum first)] ---> [Day 90: Glacier Flexible Retrieval] ---> [Day 2,555: Expire after 7 years]
:::

<!-- SLIDE 2.09 -->
## Versioning Keeps Every Copy
:::two-column
:left-column
### Expire Noncurrent Versions
icon: layers
- **Key Parameter:** A delete without a version ID adds a delete marker
- **Mechanism:** NoncurrentVersionExpiration removes old copies; AbortIncompleteMultipartUpload cleans up parts
:right-column
### The Trap
- **Planted Distractor:** Suspend versioning to cut the bill
- **Why It Fails:** Suspending changes new writes only. Every existing version stays and is billed.
:::

<!-- SLIDE 2.10 -->
## Keeping What Must Be Kept
:::two-column
:left-column
### S3 Object Lock
icon: lock
- **Key Parameter:** Governance: special permission can override · compliance: nobody, not even root
- **Mechanism:** Legal hold: no date, stays until removed
:right-column
### The Trap
- **Planted Distractor:** Governance mode stops every user, admins included
- **Why It Fails:** Users with the bypass permission can override governance. Only compliance stops everyone.
:::

<!-- SLIDE 2.11 -->
## Practice: Costs Keep Rising
:::stat-callout
icon: circle-question-mark
### Noncurrent expiration + abort incomplete uploads
- **Label:** Answer: C and E
- **Context:** Expiring current versions in a versioned bucket only makes them noncurrent.
:::

<!-- SLIDE D03 -->
:::divider
### 03
## The Upload That Never Touched the Server
- **Objectives:** 2.1.4, 2.1.5
:::

<!-- SLIDE 2.12 -->
## Presigned PUT from a Phone
:::horizontal-flow
icons: smartphone, server, pen-line, cloud-upload
[Phone Asks: Upload URL for this key] ---> [Backend Checks: Does this inspector own the job?] ---> [Backend Signs: getSignedUrl, expiresIn 300] ---> [Phone Uploads: Straight to S3, same Content-Type]
:::

<!-- SLIDE 2.13 -->
## Three Rules for Presigned URLs
:::two-column
:left-column
### The Signer Decides
icon: key-round
- **Key Parameter:** Carries the signer's permissions · anyone holding it can use it
- **Mechanism:** Can't outlive the credentials that signed it; 7 days max with SigV4
:right-column
### The Trap
- **Planted Distractor:** Set expiresIn to 7 days in Lambda and it lasts 7 days
- **Why It Fails:** The role's credentials are temporary. The URL dies with them.
:::

<!-- SLIDE 2.14 -->
## CloudFront Signing
:::two-column
:left-column
### URL for One File, Cookie for Many
icon: cookie
- **Key Parameter:** Private bucket + origin access control; key group holds your public key
- **Mechanism:** Signed cookies cover a whole folder or video without changing URLs
:right-column
### The Trap
- **Planted Distractor:** Presigned URLs can't last more than an hour
- **Why It Fails:** One hour is the CLI presign default, not a limit
:::

<!-- SLIDE 2.15 -->
## Practice: Links Die Within Hours
:::stat-callout
icon: circle-question-mark
### Temporary role credentials expired
- **Label:** Answer: A
- **Context:** A presigned URL can't outlive the credentials that signed it.
:::

<!-- SLIDE D04 -->
:::divider
### 04
## Tables Without Columns
- **Objectives:** 1.3.4, 1.1.5
:::

<!-- SLIDE 2.16 -->
## Table, Item, Attribute, Key
:::horizontal-flow
icons: table, rows-3, tag, key-round
[Table: No fixed columns] ---> [Item: Up to 400 KB] ---> [Attributes: Any, per item] ---> [Primary Key: Partition key, or partition + sort]
:::

<!-- SLIDE 2.17 -->
## GetItem Needs the Whole Key
:::two-column
:left-column
### Query Reads One Collection
icon: search
- **Key Parameter:** GetItem: partition key + sort key, one item
- **Mechanism:** Query: partition key =, sort key =, <, >, between, begins_with
:right-column
### The Trap
- **Planted Distractor:** Scan with a filter to get one inspector's items
- **Why It Fails:** A Scan reads the whole table, then filters. Given the partition key, Query.
:::

<!-- SLIDE 2.18 -->
## Practice: November for R-204
:::stat-callout
icon: circle-question-mark
### Query with begins_with
- **Label:** Answer: D
- **Context:** Partition key equals R-204, sort key begins with 2026-11.
:::

<!-- SLIDE D05 -->
:::divider
### 05
## Everybody Wrote to the Same Key
- **Objectives:** 1.3.4
:::

<!-- SLIDE 2.19 -->
## Each Partition Has a Ceiling
:::stat-callout
icon: flame
### 1,000 WCU · 3,000 RCU
- **Label:** Per partition, per second
- **Context:** A key with few values puts the load on one partition, however much the table has.
:::

<!-- SLIDE 2.20 -->
## Hot Partition
:::two-column
:left-column
### Spread the Key
icon: shuffle
- **Key Parameter:** High cardinality: sensorId, userId, orderId
- **Mechanism:** Need a busy key anyway? Shard it: date#0 to date#9. Contributor Insights finds hot keys
:right-column
### The Trap
- **Planted Distractor:** Switch to on-demand or raise capacity
- **Why It Fails:** On-demand has the same per-partition ceilings
:::

<!-- SLIDE 2.21 -->
## Practice: Date as Partition Key
:::stat-callout
icon: circle-question-mark
### High-cardinality partition key
- **Label:** Answer: B
- **Context:** Total capacity looks fine and writes still throttle: it's the key.
:::

<!-- SLIDE D06 -->
:::divider
### 06
## Capacity Math on a Napkin
- **Objectives:** 1.3.4
:::

<!-- SLIDE 2.22 -->
## Read and Write Units
:::horizontal-flow
icons: calculator, scale, divide, copy
[1 RCU: 1 strong read/sec, up to 4 KB] ---> [Eventual: Half] ---> [Transactional: Double] ---> [1 WCU: 1 write/sec, up to 1 KB]
:::

<!-- SLIDE 2.23 -->
## Round the Size First
:::stat-callout
icon: calculator
### 9 KB → 12 KB → 3 units
- **Label:** 40 strong reads/sec = 120 RCU
- **Context:** Then halve for eventually consistent (60) or double for transactional (240).
:::

<!-- SLIDE 2.24 -->
## On-Demand or Provisioned?
:::two-column
:left-column
### Match the Traffic
icon: gauge
- **Key Parameter:** On-demand: new, spiky, unpredictable · provisioned + auto scaling: steady
- **Mechanism:** Over capacity: ProvisionedThroughputExceededException; the SDK retries first
:right-column
### The Trap
- **Planted Distractor:** Divide 9 by 4, multiply, round at the end
- **Why It Fails:** Rounding last gives 90 RCU. Round the item size up first: 120.
:::

<!-- SLIDE 2.25 -->
## Practice: 30 Reads of 10 KB
:::stat-callout
icon: circle-question-mark
### 45 RCU
- **Label:** Answer: C
- **Context:** 10 KB rounds to 3 units · × 30 = 90 strong · half for eventual = 45.
:::

<!-- SLIDE 2.26 -->
:::divider
### 10
## Minute Break. Part 2 Starts After It.
:::

<!-- SLIDE 2.27 -->
## Where We Left Off
:::horizontal-flow
icons: folder-open, layers, link, key-round, flame
[Keys: Prefixes aren't folders] ---> [Versions: Expire noncurrent ones] ---> [Presigned: Signer's rights, signer's clock] ---> [DynamoDB: GetItem vs Query] ---> [Capacity: Hot keys; round first]
:::

<!-- SLIDE D07 -->
:::divider
### 07
## The Job That Came Back Unfinished
- **Objectives:** 1.3.4
:::

<!-- SLIDE 2.28 -->
## Eventually or Strongly Consistent
:::horizontal-flow
icons: eye, clock, shield-check, git-branch
[Default: Eventually consistent, half price] ---> [Usually: Caught up within a second] ---> [ConsistentRead: Latest write, full price] ---> [GSI: Eventually consistent only]
:::

<!-- SLIDE 2.29 -->
## Stale Read After a Write
:::two-column
:left-column
### Use What the Write Returns
icon: refresh-cw
- **Key Parameter:** ReturnValues ALL_NEW returns the item after the update
- **Mechanism:** Or GetItem with ConsistentRead: true on the base table or an LSI
:right-column
### The Trap
- **Planted Distractor:** Query the GSI with ConsistentRead: true
- **Why It Fails:** DynamoDB rejects it with a ValidationException
:::

<!-- SLIDE 2.30 -->
## Practice: Drop the GetItem
:::stat-callout
icon: circle-question-mark
### ReturnValues ALL_NEW
- **Label:** Answer: A
- **Context:** The write already knows the new item. No second request.
:::

<!-- SLIDE D08 -->
:::divider
### 08
## The Report That Stopped at Fourteen
- **Objectives:** 1.3.4, 1.1.5
:::

<!-- SLIDE 2.31 -->
## Query vs Scan
:::horizontal-flow
icons: search, book-open, list-filter, refresh-cw
[Query: One partition key, sort key order] ---> [Scan: Every item in the table] ---> [1 MB Pages: LastEvaluatedKey means more] ---> [Paginator: paginateQuery, paginateScan]
:::

<!-- SLIDE 2.32 -->
## Filters Don't Save Capacity
:::two-column
:left-column
### You Pay for What Is Read
icon: list-filter
- **Key Parameter:** ScannedCount = read and charged · Count = kept after the filter
- **Mechanism:** Projection shrinks the response, not the RCUs
:right-column
### The Trap
- **Planted Distractor:** A filter expression lowers the capacity used
- **Why It Fails:** Filters run after the read. Only reading fewer items helps.
:::

<!-- SLIDE 2.33 -->
## An Empty Page Isn't the End
:::two-column
:left-column
### Follow LastEvaluatedKey
icon: file-search
- **Key Parameter:** Count 0 + LastEvaluatedKey = keep paging
- **Mechanism:** Pass it back as ExclusiveStartKey
:right-column
### The Trap
- **Planted Distractor:** Count 0 means nothing matches
- **Why It Fails:** Only the first megabyte was filtered
:::

<!-- SLIDE 2.34 -->
## Practice: Count 0, Key Returned
:::stat-callout
icon: circle-question-mark
### Keep paging
- **Label:** Answer: B
- **Context:** Send ExclusiveStartKey = LastEvaluatedKey until it's gone.
:::

<!-- SLIDE D09 -->
:::divider
### 09
## The Index You Can't Add Later
- **Objectives:** 1.3.4
:::

<!-- SLIDE 2.35 -->
## Two Kinds of Secondary Index
:::horizontal-flow
icons: list-tree, calendar-clock, git-branch, shield-check
[GSI: Own partition and sort key] ---> [GSI Rules: Add any time, eventual only, up to 20] ---> [LSI: Same partition key, new sort key] ---> [LSI Rules: At table creation only, strong reads, up to 5]
:::

<!-- SLIDE 2.36 -->
## Projections and Backfill
:::two-column
:left-column
### Plan Access Patterns First
icon: layers
- **Key Parameter:** KEYS_ONLY, INCLUDE or ALL · sparse: no key attribute, not in the index
- **Mechanism:** A new GSI backfills: CREATING until ACTIVE
:right-column
### The Trap
- **Planted Distractor:** Add an LSI to the existing table
- **Why It Fails:** LSIs exist only if defined when the table is created
:::

<!-- SLIDE 2.37 -->
## Practice: Alternate Sort Key, Strong Reads
:::stat-callout
icon: circle-question-mark
### LSI at table creation
- **Label:** Answer: D
- **Context:** The table doesn't exist yet, so this is the moment for an LSI.
:::

<!-- SLIDE D10 -->
:::divider
### 10
## Two Bookings for the Same Nine O'Clock
- **Objectives:** 1.3.4, 1.3.1, 1.1.3
:::

<!-- SLIDE 2.38 -->
## Conditional Write
:::horizontal-flow
icons: calendar-clock, pen-line, circle-x, check
[PutItem: Replaces the item by default] ---> [Condition: attribute_not_exists(inspectorId)] ---> [Second Writer: ConditionalCheckFailedException] ---> [Result: One booking, one clear error]
:::

<!-- SLIDE 2.39 -->
## Optimistic Locking and Transactions
:::two-column
:left-column
### Check, Then Write, in One Step
icon: lock
- **Key Parameter:** Version attribute: write version + 1 only if version is unchanged
- **Mechanism:** TransactWriteItems: up to 100 actions, all or nothing, 2 WCU each; ClientRequestToken
:right-column
### The Trap
- **Planted Distractor:** Read the item, compare in code, then write
- **Why It Fails:** Someone can write between your read and your write
:::

<!-- SLIDE 2.40 -->
## Time to Live
:::two-column
:left-column
### Best Effort, in the Background
icon: hourglass
- **Key Parameter:** Number attribute, Unix epoch seconds; no write capacity used
- **Mechanism:** Deleted typically within a few days; still readable until then
:right-column
### The Trap
- **Planted Distractor:** Set TTL to delete faster
- **Why It Fails:** There's no such setting. Filter expired items in code.
:::

<!-- SLIDE 2.41 -->
## Practice: Holds That Never Expire
:::stat-callout
icon: circle-question-mark
### Epoch-seconds Number + treat past expiresAt as expired
- **Label:** Answer: B and D
- **Context:** Fix the format so TTL works, and fix the rule for the days before it does.
:::

<!-- SLIDE D11 -->
:::divider
### 11
## Streams, and the Upload That Broke Overnight
- **Objectives:** 1.3.4, 2.1.4
:::

<!-- SLIDE 2.42 -->
## DynamoDB Streams
:::horizontal-flow
icons: pen-line, activity, eye, zap
[Change: Insert, update, delete] ---> [Record: In order per item, 24 hours] ---> [View Type: KEYS_ONLY ... NEW_AND_OLD_IMAGES] ---> [Lambda: Event source mapping (Session 3)]
:::

<!-- SLIDE 2.43 -->
## The Ticket Method
:::horizontal-flow
icons: triangle-exclamation-point, user-search, clock-arrow-left, wrench
[Read the Error: Checksum, not AccessDenied] ---> [Who Signed?: Same role, same policy] ---> [What Changed?: SDK update: CRC32 by default] ---> [Smallest Fix: requestChecksumCalculation: WHEN_REQUIRED]
:::

<!-- SLIDE 2.44 -->
## Presigned Upload Fails After an Update
:::two-column
:left-column
### Let the Error Decide
icon: file-search
- **Key Parameter:** The URL now carries x-amz-checksum-crc32 for an empty body
- **Mechanism:** The phone sends a real photo, so S3 rejects the mismatch
:right-column
### The Trap
- **Planted Distractor:** Add s3:PutObject to the signing role
- **Why It Fails:** A permissions problem says AccessDenied. This one names a checksum.
:::

<!-- SLIDE 2.45 -->
## Practice: Checksum Mismatch
:::stat-callout
icon: circle-question-mark
### requestChecksumCalculation: WHEN_REQUIRED
- **Label:** Answer: C
- **Context:** Set on the S3 client that creates the URLs.
:::

<!-- SLIDE 2.46 -->
## Lab: CloudShell, Your Own Account
:::horizontal-flow
icons: table, layers, link, search, trash, clipboard-check
[Table First: Key schema and GSI] ---> [Bucket: Versioning, lifecycle] ---> [Presigned: PUT, break it, expire it] ---> [Items: Query, Scan, GSI, conditions] ---> [Clean Up: Bucket only; keep the table] ---> [Worksheet: Keys, RCUs, ticket]
:::

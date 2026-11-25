# Opening — Where Your Data Lives

*Objectives: DVA-C03 1.3.1, 1.3.4, 2.1.4 (overview) · callbacks to Session 1*

[SLIDE 2.01]

Good evening, everybody, and welcome to Session 2. Last time we built the ground floor. Your code found its credentials by walking the provider chain, it signed every request with Signature Version 4, it paged through results with a paginator, and it retried the calls that were worth retrying. Every one of those ideas comes back tonight, because tonight your code finally has somewhere to put things.

[SLIDE 2.02]

Here's the plan. The first half of tonight is Amazon S3, and the second half is Amazon DynamoDB, with a hinge in the middle. In S3 we'll cover how buckets and keys really work, how lifecycle rules and versioning decide what you pay to keep data and for how long, and how presigned URLs let someone upload or download a file without ever getting AWS credentials. Then we cross over to DynamoDB. We'll cover tables and keys, how to pick a partition key that doesn't melt down on a busy day, how to do the capacity math, how read consistency works, the difference between a Query and a Scan, the two kinds of secondary indexes, and the features that protect your data when two people write at the same moment. We'll finish with DynamoDB Streams and a full ticket.

These are the exam tasks about data lifecycle, about DynamoDB keys, consistency and indexes, and about presigned URLs. They sit in the two biggest domains, development and security, and I'd expect a fair number of questions to touch them, because almost every application on AWS stores something in S3 or DynamoDB.

[SLIDE 2.03]

One callback before we start. In Session 1 we said a signed request proves who sent it, when, and to which service. Hold on to that, because a presigned URL is nothing more than a signed request that you hand to somebody else to send. Once you see it that way, most of the presigned URL questions answer themselves.

Our company tonight is a home inspection business in Phoenix. When somebody buys a house, one of their inspectors spends three hours crawling through the attic and under the sinks, taking a few hundred photos, and writing a report that the buyer, the seller and two real estate agents all need by the next morning. The company has a phone app for inspectors, a web portal for homeowners, and a small development team. You'll meet Dana, who writes the backend; Jamal, who builds the phone app; Wen, who does reporting and came from a SQL Server shop; Marcus, the team lead; and Priya, who runs operations and reads the AWS bill every month. The company also started selling small leak sensors that homeowners stick under their water heaters, and those sensors are going to cause us some trouble later tonight.

Same method as last time. An everyday version of the idea, then the office, then exactly what broke and the setting that fixes it, then the trap, then a practice question. Put your answers in the chat before I explain them. Let's start with the bucket.

# Block 1 — The Folder That Isn't a Folder

*Objectives: DVA-C03 1.1.5 (S3 API); 1.1.8 preview (S3 event notifications); 1.3.1 (storage classes)*

[SLIDE 2.04]

Here's the everyday version. Picture a big parking garage with a valet stand. When you drop off your car, you don't get a parking spot. You get a claim ticket with a long number on it, and the valet puts your car wherever there's room. The number on your ticket might be printed as "Level 3, Row B, number 47," but that's just a label. There's no Level 3 sign that you could rename, and if you wanted your ticket to say Level 5 instead, the valet would have to move the car and write you a new ticket.

S3 works the same way. A bucket is the garage. Its name has to be unique across every AWS account in the world, which is why your lab buckets have your account number and a random number in them. Inside the bucket, every object has a key, and the key is the object's entire name, slashes and all. When Jamal's app uploads a photo with the key photos/2026/job-881/roof-01.jpg, S3 doesn't make a photos folder, a 2026 folder and a job-881 folder. It stores one object whose name happens to contain slashes. The part before the last slash is called a prefix, and the console draws prefixes as folders because that's friendlier to look at. But the folders aren't real. They're a way of displaying the names.

A few numbers worth knowing. One object can be as large as five terabytes. A single PUT request can upload up to five gigabytes, and above about a hundred megabytes AWS recommends a multipart upload, which sends the file in parts and can retry just the part that failed. And S3 gives you strong read-after-write consistency. The moment a PUT succeeds, the next GET or list returns the new object. That's been true since 2020, so if an answer says you must wait for S3 to catch up after writing a new object, that answer is out of date.

[SLIDE 2.05]

Here's the office. Last week Marcus decided the photo keys should start with inspections/ instead of photos/, so they'd match the new portal. Jamal opened a ticket that said, "Rename the photos folder to inspections." He figured it would take five minutes. There were forty thousand photos under that prefix.

Here's what actually happens. A general purpose bucket has no rename for a prefix, because the prefix isn't a thing that exists on its own. To move forty thousand objects, you copy each one to its new key and then delete each original. That's forty thousand copy requests and forty thousand delete requests. For a job that size you'd use S3 Batch Operations, which runs one operation across a list of objects and reports which ones failed, instead of writing a loop yourself. Dana's actual fix was smaller. She left the photo keys alone and changed the portal, because the key doesn't need to be pretty. It needs to be stable. The friendly information, like which job a photo belongs to, belongs in a database, and that's where DynamoDB comes in later tonight.

[SLIDE 2.06]

Two more S3 features you'll need. The first is storage classes. S3 Standard is for data you read often. S3 Standard-Infrequent Access costs less to store but charges you each time you read, and it bills at least thirty days. S3 One Zone-Infrequent Access keeps the data in a single Availability Zone, so it's cheaper and less durable against losing a data center. S3 Intelligent-Tiering moves each object between tiers for you when you don't know how often it'll be read. And the Glacier classes are for archives. We'll come back to those in the next block.

The second is event notifications. A bucket can send a message every time an object is created or deleted, to a Lambda function, an SQS queue, an SNS topic, or Amazon EventBridge. Delivery is at least once and usually takes seconds. That's how a photo upload can start a thumbnail job with no polling at all. You'll build exactly that in Session 3, and we'll compare the destinations in Session 4.

Here's the trap. A question describes a "folder" and asks for the fastest or simplest way to rename or move it, and one choice offers a single call, like a rename on the prefix or a change to the folder's name in the bucket settings. It sounds right because the console shows you a folder. But in a general purpose bucket there's nothing to rename. There's a newer RenameObject call, but it works only on single objects in S3 Express One Zone directory buckets, not on prefixes in the buckets you use every day.

[SLIDE 2.07]

Let's try one. A developer must move 40,000 objects from the prefix photos/ to the prefix archive/photos/ in an S3 general purpose bucket. What does the move require?

A. One RenameObject call on the photos/ prefix
B. Changing the folder's name in the bucket properties in the console
C. Copying each object to the new key, then deleting the original
D. Turning on versioning so the old keys point to the new keys

A is the trap. RenameObject renames one object, and only in directory buckets, so it can't move a prefix in a general purpose bucket. B fails for the same reason: there's no folder to rename, just keys that share their first few characters. D misunderstands versioning. Versioning keeps older copies of the same key. It never points one key at another. C is the answer. Copy each object to its new key, delete the original, and use S3 Batch Operations when the list is long.

# Block 2 — Seven Years of Inspection Reports

*Objectives: DVA-C03 1.3.1 (data lifecycle: S3 Lifecycle, versioning, retention)*

[SLIDE 2.08]

Here's the everyday version. Think about how a family keeps paperwork. This month's bills sit on the kitchen counter, where you can grab them. Last year's tax return goes in the filing cabinet in the hall. The tax returns from six years ago go in a box in the garage, where it takes twenty minutes and a ladder to find anything. And once a year somebody shreds what's old enough to throw away. Nobody decides each paper's fate one at a time. There's a rule, and the papers move when they're old enough.

An S3 lifecycle rule is that rule, written down. It applies to the whole bucket or to objects that match a prefix, a tag or a size, and it does two kinds of things. Transition actions move objects to a cheaper storage class after a number of days. Expiration actions delete them. S3 evaluates the rules in the background, roughly once a day, so nothing moves the second it turns thirty days old. A couple of guardrails: an object has to spend at least thirty days in S3 Standard before a lifecycle rule can move it to one of the Infrequent Access classes, and by default lifecycle doesn't transition objects smaller than 128 kilobytes, because the per-object cost would eat the savings.

[SLIDE 2.09]

Here's the office. The state requires the company to keep every inspection report for seven years. Priya noticed the S3 bill climbing every single month. She asked Wen to look, and Wen found that homeowners download a report three or four times in the first week and almost never again. So Dana wrote a lifecycle rule on the reports/ prefix. After thirty days, move to S3 Standard-Infrequent Access. After ninety days, move to S3 Glacier Flexible Retrieval. After 2,555 days, which is seven years, expire.

Two months later the bill was still climbing. Here's what broke. The bucket has versioning turned on, which is a good thing. Versioning keeps every version of a key, so if the app overwrites a report with a bad copy, you can get the old one back. When you delete an object in a versioned bucket without naming a version, S3 doesn't erase anything. It adds a delete marker on top, and the older versions are still there, still billed. Inspectors edit a report five or six times while they write it, and every save left a noncurrent version behind. Those noncurrent versions never expired, because Dana's rule only talked about the current version. The fix was one more action in the same rule: NoncurrentVersionExpiration, thirty days after a version stops being current. She also added AbortIncompleteMultipartUpload, so half-finished uploads from phones that lost signal get cleaned up after seven days instead of sitting there forever.

The Glacier classes are worth knowing by their retrieval times. S3 Glacier Instant Retrieval returns data in milliseconds, for archives that still get read now and then. S3 Glacier Flexible Retrieval takes minutes to hours to restore. Expedited is one to five minutes, standard is three to five hours, and bulk is five to twelve. S3 Glacier Deep Archive is the cheapest, and a standard restore finishes within twelve hours. A restore makes a temporary copy that you can read for the number of days you ask for. And both Flexible Retrieval and Deep Archive have minimum billing periods, ninety days and a hundred eighty days.

[SLIDE 2.10]

One more piece of lifecycle is retention, meaning keeping something even when somebody wants it gone. That's S3 Object Lock, which needs versioning. A retention period in governance mode stops ordinary users from deleting or overwriting a version, but users with a special permission can still override it. Compliance mode means nobody can delete the version or shorten the period, not even the root user, until the date passes. A legal hold has no date at all. It stays until someone removes it, which is what a lawyer asks for when a house sale ends up in court.

Here's the trap. A question says a versioned bucket has an expiration rule, but storage costs keep growing, and one choice says to suspend versioning. That feels right, because versioning is what's piling up the copies. But suspending versioning only changes what happens to new writes. Every version already in the bucket stays exactly where it is and keeps costing money. The fix is a lifecycle action that targets noncurrent versions.

[SLIDE 2.11]

Let's try one, and this one is a choose two. A versioned S3 bucket stores training videos that are uploaded with multipart uploads, and some uploads fail partway through. A lifecycle rule expires objects 365 days after they're created, but storage costs keep rising. Which two lifecycle actions will reduce the cost? Choose two.

A. Suspend versioning on the bucket
B. Shorten the expiration rule to 90 days
C. Add a NoncurrentVersionExpiration action
D. Transition current versions to S3 Standard-IA after one day
E. Add an AbortIncompleteMultipartUpload action

A is the trap we just talked about. Suspending versioning leaves every existing version in place. B sounds aggressive, but in a versioned bucket, expiring the current version just adds a delete marker and turns it into a noncurrent version, which is still billed. D isn't allowed, because lifecycle can't move objects to Standard-IA until they've spent thirty days in Standard. C deletes the old versions that are piling up, and E cleans up the parts of uploads that never finished. The answers are C and E.

# Block 3 — The Upload That Never Touched the Server

*Objectives: DVA-C03 2.1.4 (presigned URLs: S3, CloudFront); 2.1.5 (authenticated calls)*

[SLIDE 2.12]

Here's the everyday version. You've ordered groceries for delivery, and you're stuck at work. You don't give the delivery driver a copy of your house key. You give them the code to the lockbox on the side porch, and the code only works until six o'clock tonight. The driver can drop off groceries, but they can't get into the house, and tomorrow the code is useless.

A presigned URL is that lockbox code. Your backend, which has AWS credentials, signs one specific request ahead of time, such as "put an object with this key into this bucket," and turns the signature into query parameters on a URL. Then it hands the URL to someone who has no AWS credentials at all, like a phone app or a homeowner's browser. When they send the request, S3 checks the signature just as it would check any signed call. The URL works for one action on one object until it expires. In the SDK for JavaScript you build the command, the same PutObjectCommand or GetObjectCommand you already know, and pass it to getSignedUrl with an expiresIn value in seconds. The default is fifteen minutes, and the longest you can set with Signature Version 4 is seven days.

Here's the office. Jamal's phone app used to upload inspection photos through the company's API. The photo went from the phone to API Gateway, to a Lambda function, and then to S3. Phone cameras got better, photos got bigger, and the big ones started failing, because a Lambda function called synchronously accepts a request of only six megabytes, and API Gateway in front of it caps a request at ten. Dana changed the flow. Now the app asks the backend for a presigned PUT URL for the exact key it wants to write. The backend checks that the inspector owns that job, signs the URL for five minutes, and returns it. The phone uploads straight to S3. The photo never touches the server, so the size limit and the bandwidth bill both disappear. One detail bit them on day one. Dana signed the URL with a ContentType of image/jpeg, and Jamal's first build sent no Content-Type header. S3 answered 403 SignatureDoesNotMatch, because a header that was signed has to be sent exactly as it was signed.

[SLIDE 2.13]

Now three rules that decide most questions. First, a presigned URL carries the permissions of whoever signed it. If the role that signed the URL isn't allowed to put objects in that bucket, the URL gets a 403, no matter how valid the signature is. You can't presign your way into more access than you have. Second, anybody holding the URL can use it until it expires. There's no sign-in, so keep the expiry short and the action narrow. Third, a URL can't outlive the credentials that signed it. If it was signed with temporary credentials, it stops working when those credentials expire, even if you asked for seven days.

That third rule broke the homeowner emails. When a report was finished, a Lambda function emailed the homeowner a presigned download link with expiresIn set to seven days. Within hours, homeowners were calling to say the link was dead. The function signed with its execution role, and as we said in Session 1, a role's credentials are temporary. When they expired, every link they'd signed died too. The fix was to stop emailing the S3 link. The email now points to the portal, and the portal creates a fresh presigned URL when the homeowner clicks, after checking who they are.

[SLIDE 2.14]

For the portal itself, the team uses CloudFront, AWS's content delivery network. The bucket stays private, and an origin access control lets only CloudFront read from it. CloudFront has its own signing, done with a key pair: you upload the public key to CloudFront in a key group, and your application signs with the private key. A CloudFront signed URL protects one file. A signed cookie protects many files at once, like a whole report folder with sixty photos, or every segment of a streaming video, without changing a single URL on the page. And because CloudFront signatures don't come from IAM credentials, they last as long as the policy says.

Here's the trap. A question says links were created with a seven-day expiry but stop working within hours, and one choice says presigned URLs can never last more than an hour. That's a real number in the wrong place. One hour is the default for the CLI's presign command, not a limit. The question is pointing you at temporary credentials.

[SLIDE 2.15]

Let's try one. A Lambda function creates presigned GET URLs for S3 objects with expiresIn set to seven days and emails them to customers. Customers report that the links stop working within a few hours. What is the most likely cause?

A. The URLs were signed with temporary role credentials that expired
B. Presigned URLs can't be valid for more than one hour
C. The bucket must have versioning turned on for presigned links to last
D. The customers' browsers don't send AWS credentials with the request

B is the trap. Seven days is allowed with Signature Version 4, and one hour is just the CLI's default. C has nothing to do with it, because versioning keeps older copies and has no effect on signatures. D describes how presigned URLs are supposed to work: the signature is in the URL, so the browser doesn't need credentials. A is the answer. A URL can't outlive the credentials that signed it, and a Lambda execution role's credentials are temporary.

# Block 4 — Tables Without Columns

*Objectives: DVA-C03 1.3.4 (DynamoDB keys, attributes); 1.1.5 (SDK calls)*

[SLIDE 2.16]

Here's the everyday version. Think of a coat check at a theater. You hand over your coat, you get a numbered tag, and the attendant hangs your coat on the rack with that number. The attendant doesn't care what's in the pockets, whether it's a coat or an umbrella, or whether it has a hood. When you come back, you hand over the tag and you get your things in seconds, no matter how many hundreds of coats are on the racks. What you can't do is walk up and say, "I'd like all the blue coats, please." The rack is organized by tag number and nothing else.

DynamoDB is that coat check. A table holds items, an item is a set of attributes, and an attribute is a name and a value. An item can be up to 400 kilobytes, counting the attribute names. The only thing DynamoDB insists on is the primary key. Every other attribute is optional, so two items in the same table can look completely different. The primary key comes in two shapes. A simple primary key is just a partition key. A composite primary key is a partition key plus a sort key. DynamoDB hashes the partition key to decide which partition, meaning which slice of storage, holds the item. Items that share a partition key are stored together, sorted by the sort key, and that group is called an item collection.

[SLIDE 2.17]

Here's the office. Wen built the new inspections table. She came from SQL Server, so her first sketch had twenty columns and a schema review. Dana talked her down to two decisions: the partition key is inspectorId, and the sort key is inspectedAt, written as an ISO 8601 date and time like 2026-11-14T09:30:00Z. That format sorts correctly as plain text, which matters, because the sort key is the only order DynamoDB keeps for you.

The first bug came the next morning. Wen wanted Ruth's inspection from November 14, and she called GetItem with just the partition key, inspectorId R-204. DynamoDB returned a ValidationException that said the provided key element doesn't match the schema. Here's what happened. GetItem reads exactly one item, so it needs the whole primary key, partition key and sort key both. With only the partition key, she wasn't asking for one item. She was asking for an item collection, and the call for that is Query. A Query takes the partition key with an equals sign, and optionally a condition on the sort key: equal, less than, greater than, between, or begins with. So "all of Ruth's November inspections" is a Query with inspectorId equal to R-204 and inspectedAt beginning with 2026-11. DynamoDB jumps straight to Ruth's item collection and reads just November, in order.

The second surprise was a happy one. A week later Marcus wanted to record the roof type on each inspection. In SQL Server, Wen would have written an ALTER TABLE and scheduled it for the weekend. In DynamoDB she just started writing a roofType attribute on new items. Old items don't have it, and that's fine.

In the lab you'll use the document client from the lib-dynamodb package. The low-level client wants every value wrapped with its type, like S for string and N for number. The document client lets you pass plain JavaScript objects and does the wrapping for you.

Here's the trap. A question asks for the most efficient way to get a set of items that share a partition key, and one choice is a Scan with a filter expression. It sounds reasonable, because a filter is how you'd narrow results in SQL. But a Scan reads every item in the table and filters afterward, which is the slowest and most expensive way to get there. When the question gives you the partition key, the answer is almost always a Query.

[SLIDE 2.18]

Let's try one. A DynamoDB table has the partition key inspectorId and the sort key inspectedAt, stored as ISO 8601 strings. A developer needs every November 2026 inspection for inspector R-204, reading as little data as possible. Which call should the developer use?

A. A Scan with a filter expression on inspectorId and the month
B. A GetItem call with inspectorId set to R-204
C. A BatchGetItem call listing every date in November
D. A Query on R-204 with inspectedAt beginning with 2026-11

A is the trap. A Scan reads the whole table and then throws most of it away. B fails because GetItem needs the full primary key, and it returns only one item anyway. C would need the exact sort key of every item, down to the second, and nobody knows those in advance. D is the answer. Query goes straight to R-204's item collection, and begins_with on the sort key reads just November.

# Block 5 — Everybody Wrote to the Same Key

*Objectives: DVA-C03 1.3.4 (high-cardinality partition keys, hot partitions)*

[SLIDE 2.19]

Here's the everyday version. Picture a big grocery store with twenty checkout lanes, and a rule that says customers have to pick their lane by the first letter of the day of the week. On any given day, every single customer lines up in one lane, and the other nineteen cashiers stand around with nothing to do. The store has plenty of capacity. It's just all in the wrong place.

That's a hot partition. DynamoDB spreads a table across partitions by hashing the partition key, and each partition has its own ceiling: about 3,000 read capacity units and 1,000 write capacity units per second. If the key has lots of different values, which we call high cardinality, like a user ID, an order ID or a device ID, the traffic spreads across all the partitions. If the key has only a few values, or if one value gets most of the traffic, the requests pile onto one partition and hit its ceiling, even though the table as a whole is barely busy. DynamoDB has adaptive capacity, which shifts capacity toward busy partitions and can split them, but it can't make one key value faster than one partition allows.

[SLIDE 2.20]

Here's the office. The leak sensors took off. Two hundred thousand homes now have one, and each sensor reports once a minute. That's a little over three thousand writes a second, all day. Wen built the readings table with the partition key readingDate, like 2026-11-25, and a sort key of the sensor ID plus the time, because the dashboard shows today's readings. On launch day the sensors started getting throttling errors, and the readings fell further and further behind.

Here's what broke, step by step. Every reading written today had the same partition key, today's date. One key value means one partition, and one partition can take about a thousand writes a second. The sensors were sending three thousand. Marcus raised the table's write capacity to ten thousand, and the throttling didn't change at all, because the problem wasn't the table's total. It was one partition's ceiling.

Dana changed the key. The partition key is now sensorId, and the sort key is the reading time. Two hundred thousand sensor IDs spread the writes across every partition, and "show me the last day for this sensor" is a simple Query. For the dashboard, which really does need everything from today, the team uses write sharding. They write a small daily summary item with the partition key set to the date plus a random number from zero to nine, like 2026-11-25#7, which spreads today's summary writes across ten key values. The dashboard queries all ten and adds them up. To find a hot key in the first place, CloudWatch Contributor Insights for DynamoDB shows which partition keys are getting the most traffic.

Here's the trap. A question describes throttling on a table whose total consumed capacity is well below what's provisioned, and one choice says to switch to on-demand capacity or to raise the provisioned capacity. It sounds like a capacity problem, because the error is about throughput. But on-demand tables have the same per-partition ceilings, and more total capacity doesn't help one hot key. When the total looks fine and you're still throttled, think about the key.

[SLIDE 2.21]

Let's try one. A table stores sensor readings with the current date as its partition key. During the day, writes are throttled, but CloudWatch shows the table's total consumed write capacity is well under its provisioned write capacity. What should the developer do?

A. Switch the table from provisioned to on-demand capacity mode
B. Use a high-cardinality partition key, such as sensor ID
C. Add a local secondary index on the reading date
D. Use strongly consistent reads for the dashboard

A is the trap. On-demand mode has the same per-partition limits, so a single date key still lands every write on one partition. C doesn't help writes at all. An index is extra writes, not fewer, and a local secondary index shares the same partition key anyway. D is about reads, and the problem here is writes. B is the answer. Spread the writes with a key that has many values.

# Block 6 — Capacity Math on a Napkin

*Objectives: DVA-C03 1.3.4 (DynamoDB capacity); 4.3 preview (cost and performance)*

[SLIDE 2.22]

Here's the everyday version. A moving company charges by the truckload, and each truck holds four boxes' worth of space. If you have five boxes, you don't pay for one and a quarter trucks. You pay for two, because the second truck still has to drive over. Every partial unit rounds up.

DynamoDB capacity works the same way, and I'd expect most capacity math questions to come down to rounding. One read capacity unit, an RCU, is one strongly consistent read per second of an item up to four kilobytes. An eventually consistent read costs half as much. A transactional read costs twice as much. One write capacity unit, a WCU, is one write per second of an item up to one kilobyte, and a transactional write costs two. The item size always rounds up to the next four kilobytes for reads and the next kilobyte for writes, before you multiply.

There are two ways to pay. On-demand mode charges per request and adjusts to your traffic on its own, with no planning. It can instantly take up to double the table's previous peak, and it keeps adjusting from there. It fits new applications, spiky traffic and traffic you can't predict. Provisioned mode means you set the RCUs and WCUs yourself, usually with auto scaling to follow the traffic. It fits steady, predictable workloads, and for those it usually costs less.

[SLIDE 2.23]

Here's the office. The homeowner portal's traffic is steady and predictable, so Marcus decided to move its table to provisioned mode. The portal does forty strongly consistent reads a second of report items that are nine kilobytes each. Marcus did the math on a napkin. Nine divided by four is two and a quarter, times forty is ninety. He set ninety RCUs, and the portal was throttled that afternoon.

Here's what went wrong. You round the item size first. Nine kilobytes is more than eight, so each read takes three four-kilobyte units, not two and a quarter. Three times forty is one hundred twenty RCUs. If the portal could live with eventually consistent reads, it would be half that, sixty. The writes needed the same care. Fifteen writes a second of items that are two and a half kilobytes means three WCUs each, so forty-five WCUs. Marcus fixed the numbers and turned on auto scaling with those as the floor.

It's worth knowing what that afternoon's throttling looked like from the code's side, because you'll see it in questions. When a provisioned table gets more requests than its capacity, DynamoDB rejects the extra ones with ProvisionedThroughputExceededException. DynamoDB does keep a little burst capacity, up to about five minutes of unused capacity, so a short spike can get through, but a steady overload can't. And here's the Session 1 callback. The SDK treats that error as throttling, so it retries with exponential backoff and jitter before your code ever sees it. That's why the first sign was pages that loaded slowly, and only later pages that failed. If you see that exception in your logs, the SDK has already retried and given up, and the fix is capacity or a better key, not another retry loop.

[SLIDE 2.24]

Here's the trap. A math question gives you an item size that isn't a multiple of four, and one choice is the answer you get if you divide first and round last. It looks exactly right, because the arithmetic is correct. The rule isn't. Round the item size up to the next four kilobytes, then multiply by the reads per second, then halve it for eventually consistent or double it for transactional. Write those three steps on your scratch paper before the exam starts.

The other half of this trap is the mode. If a question says the traffic is unpredictable or the application is brand new, the most cost-effective answer is usually on-demand, even though provisioned is cheaper per request when traffic is steady.

[SLIDE 2.25]

Let's try one. An application performs 30 eventually consistent reads per second. Each item is 10 KB. How many read capacity units does the table need?

A. 30
B. 75
C. 45
D. 90

Work it in order. Ten kilobytes rounds up to twelve, which is three four-kilobyte units. Three units times thirty reads is ninety for strongly consistent reads. Eventually consistent reads cost half, so the answer is forty-five. D is the trap, because ninety is the strongly consistent number, and the question said eventually consistent. B comes from dividing ten by four first, getting two and a half, and never rounding. A treats every read as one unit, whatever the size. The answer is C.

# Break 1

*Ten-minute break. Lecture Part 2 begins after it.*

[SLIDE 2.26]

That's the first half, and we've now got S3 covered and the foundation of DynamoDB in place. Take ten minutes. Stand up, get some water, rest your eyes. If one of those capacity questions is still bugging you, put it in the chat now and I'll pick it up when we come back. See you in ten.

# Part 2 Opening — Where We Left Off

*Objectives: DVA-C03 1.3.1, 1.3.4, 2.1.4 (review)*

[SLIDE 2.27]

Welcome back. Let's check that the first half is still where we left it. In S3, a key is the object's whole name, prefixes only look like folders, and moving a prefix means copying and deleting every object. Lifecycle rules move objects to cheaper classes and expire them, and in a versioned bucket you need a separate action for noncurrent versions, or the old copies pile up forever. Object Lock keeps what must be kept. A presigned URL is a signed request you hand to someone else, it carries the signer's permissions, and it can't outlive the credentials that signed it. CloudFront signed URLs protect one file, and signed cookies protect many.

In DynamoDB, GetItem needs the whole primary key, and Query needs the partition key and reads one item collection. A partition key needs lots of values, or one partition takes all the heat no matter how much capacity you buy. And for capacity math, round the item size up first, then multiply, then halve or double.

Here's the second half. We'll look at what you get back when you read, how Query and Scan really spend your capacity, the two kinds of indexes, the tools that keep two writers from stepping on each other, and how DynamoDB tells other code that something changed. Then we'll run a full ticket. Let's go back to the inspectors.

# Block 7 — The Job That Came Back Unfinished

*Objectives: DVA-C03 1.3.4 (read consistency)*

[SLIDE 2.28]

Here's the everyday version. You change your mailing address on a store's website. The confirmation page says, "Done!" Then you click over to your account page, and it still shows your old address. Five seconds later you refresh, and the new one is there. Nothing was lost. You just asked a copy of your record that hadn't heard the news yet.

DynamoDB keeps copies of every item in several Availability Zones. A write succeeds once enough copies have it, and the rest catch up a moment later, usually within a second. By default, every read is eventually consistent, which means it can be answered by any copy, including one that hasn't caught up. That's cheaper, half an RCU per four kilobytes, and fast. If you set ConsistentRead to true on a GetItem, Query or Scan, DynamoDB reads from a copy that's guaranteed to have every successful write, and you pay the full RCU. Strongly consistent reads work on the base table and on local secondary indexes. They don't work on global secondary indexes at all. A GSI is updated from the table in the background, so it's always eventually consistent, and if you ask a GSI for a consistent read, DynamoDB rejects the request with a ValidationException.

[SLIDE 2.29]

Here's the office. When an inspector finishes a job, the phone app calls UpdateItem to set the job's status to COMPLETE. Then it calls GetItem to redraw the job screen. Every so often the screen came back showing IN_PROGRESS, so the inspector tapped Complete again. The second tap triggered a second "your report is ready" email to the homeowner, and Priya started getting calls asking which report was the real one.

Here's what happened, step by step. The UpdateItem succeeded. A few milliseconds later, the GetItem landed on the one copy that hadn't caught up yet, and since GetItem is eventually consistent by default, DynamoDB was allowed to answer from that copy. The app showed the old status. Jamal had two fixes to choose from. One was to set ConsistentRead to true on that GetItem, which costs one full RCU instead of half. The other, which he picked, was to skip the read altogether. UpdateItem has a ReturnValues setting, and ALL_NEW returns the whole item as it looks right after the update. The write already knows the answer, so there's no reason to ask again. Dana also made the email send only when the status actually changes, which is the idempotency habit from Session 1.

Here's the trap. A question says an item written a moment ago doesn't show up when the application queries a global secondary index, and one choice says to set ConsistentRead to true on the index query. It's tempting, because it sounds exactly like the fix for this kind of problem. But GSIs can't do strongly consistent reads, and DynamoDB rejects the request. The fixes that work are to read the base table by its key with ConsistentRead, or to wait briefly and retry. You'll see that error with your own eyes in the lab.

[SLIDE 2.30]

Let's try one. An application calls UpdateItem to change an order's status and then immediately calls GetItem with the same key to show the order. Sometimes the screen shows the old status. The developer must always show the updated item and wants to remove the GetItem call entirely. What should the developer do?

A. Set ReturnValues to ALL_NEW on UpdateItem and show the returned item
B. Set ConsistentRead to true on the GetItem call
C. Query a global secondary index with ConsistentRead set to true instead
D. Wait five seconds before calling GetItem

B is the trap. It would fix the stale screen, but it keeps the GetItem call the developer wants to remove, and it doubles that read's cost. C fails twice: it's still a read, and GSIs don't support consistent reads. D slows every user down and is still a read, and five seconds is a guess, not a guarantee. A is the answer. ALL_NEW hands back the item as it looks right after the write.

# Block 8 — The Report That Stopped at Fourteen

*Objectives: DVA-C03 1.3.4 (Query vs Scan, filter and projection expressions, pagination); 1.1.5 (paginators)*

[SLIDE 2.31]

Here's the everyday version. You need every cookbook in a library. One way is to walk to the cookbook aisle, which is shelved by subject, and take what's there. The other way is to start at the first shelf in the building, pull down every single book, look at the cover, and put back anything that isn't a cookbook. You end up with the same cookbooks either way. The second way just costs you the whole afternoon.

The first way is a Query. It goes straight to one partition key and reads only that item collection, in sort key order. The second way is a Scan. It reads every item in the table. Both return at most one megabyte of data per call. If there's more, the response includes LastEvaluatedKey, and you pass that back as ExclusiveStartKey to get the next page. The paginators from Session 1, paginateQuery and paginateScan, do that loop for you. For a huge table, a parallel Scan splits the work into segments that separate workers read at the same time, which is faster but burns capacity even faster.

[SLIDE 2.32]

Here's the office. Wen built a monthly report of every inspection in the city of Mesa. Her code ran a Scan on the inspections table with a filter expression of city equal to Mesa. The report came back with fourteen inspections. The real number was a little over two thousand. And the Scan consumed far more capacity than anybody expected.

Here's what broke. First, a filter expression is applied after the items are read. DynamoDB reads up to one megabyte of items, charges you for all of them, then throws away the ones that don't match. The response shows both numbers: ScannedCount is what was read, Count is what survived the filter. Wen's first page read thousands of items and kept fourteen. Second, she didn't follow LastEvaluatedKey, so she stopped after the first page, while the response was telling her there were hundreds more pages to go. The same is true of a projection expression, which picks the attributes you want back. It makes the response smaller, but you're still charged for the whole item that was read.

The quick fix was a paginator, so the report read every page. The real fix was to stop scanning. The report needs "inspections by city and date," which is an access pattern the table's key doesn't support, and that calls for an index, which is the next block.

[SLIDE 2.33]

Here's the trap. A question shows a Query or Scan with a filter that returns a Count of zero, along with a LastEvaluatedKey, and one choice says no items match. It sounds logical, because zero results usually means nothing's there. But the filter only ran against the first megabyte. Matching items can still be on later pages, and the presence of LastEvaluatedKey tells you there are later pages. The other version of this trap says a filter or a projection reduces the capacity a read consumes. Neither one does. Only reading fewer items, with a better key or an index, does that.

[SLIDE 2.34]

Let's try one. A developer runs a Query with a filter expression. The response has a Count of 0 and includes a LastEvaluatedKey. What should the developer conclude?

A. No items in the partition match the filter expression
B. More items may match, so request the next page with ExclusiveStartKey
C. The filter expression has a syntax error
D. The Query must set ConsistentRead to true before it can return any results

A is the trap. That conclusion would be true only if there were no LastEvaluatedKey. C doesn't fit, because a syntax error comes back as a ValidationException, not as an empty page. D is about freshness, not about which items a page holds, and an eventually consistent read still returns items that were written more than a moment ago. B is the answer. Keep paging until LastEvaluatedKey is gone, or let a paginator do it.

# Block 9 — The Index You Can't Add Later

*Objectives: DVA-C03 1.3.4 (indexes: LSI and GSI, projections)*

[SLIDE 2.35]

Here's the everyday version. A phone book is sorted by last name. If you want to find people by street, you print a second book sorted by street. That second book has to be reprinted every time somebody moves, and it's never quite current. Now picture a different kind of second book: the same last-name sections, but inside each section the people are ordered by street instead of first name. That one you have to decide on before the first book is printed, because it changes how the pages are laid out.

The first book is a global secondary index, a GSI. It has its own partition key and sort key, picked from any attributes. You can add one or delete one at any time, and a table can have up to twenty by default. DynamoDB copies items into it in the background, so reads from it are eventually consistent only. In provisioned mode it has its own capacity, and if a GSI can't keep up with writes, it can throttle writes to the base table. The second book is a local secondary index, an LSI. It keeps the table's partition key and gives you a different sort key. You can create LSIs only when you create the table, up to five. They support strongly consistent reads, and they share the table's capacity. One cost: with an LSI, each partition key value's item collection is limited to ten gigabytes.

[SLIDE 2.36]

Both kinds of index have a projection, which decides which attributes are copied into the index. KEYS_ONLY copies just the keys, INCLUDE adds the attributes you name, and ALL copies the whole item. A GSI query can return only projected attributes, so project what your access pattern reads. And an index is sparse: if an item doesn't have the index's key attribute, it isn't in the index at all, which is handy for an index of just the open jobs.

Here's the office. To fix Wen's Mesa report, Dana added a GSI with the partition key city and the sort key inspectedAt. Wen ran her new Query against the index a minute later and got an error, because the index was still being built. A new GSI on an existing table has to backfill every existing item, and its status stays CREATING until that's done. Half an hour later it was ACTIVE, and the report took two seconds.

The same week, Marcus asked for an inspector's jobs sorted by fee instead of by date, with strongly consistent reads, because billing depends on it. That's an LSI: same partition key, inspectorId, with fee as the sort key. But the table already existed, so an LSI was off the table. The choices were a GSI with eventually consistent reads, or a new table with the LSI and a data copy. The lesson they wrote on the whiteboard was to list the access patterns before creating a table.

Here's the trap. A question says an existing table needs an alternate sort key with strongly consistent reads, and one choice says to add a local secondary index. It sounds exactly right, because an LSI is the alternate sort key that supports strong reads. But you can't add one to a table that already exists. Read the question for the word "existing."

[SLIDE 2.37]

Let's try one. A developer is designing a new DynamoDB table that hasn't been created yet. The application must query items with the same partition key using a different sort key, and those queries must be strongly consistent. What should the developer do?

A. Add a global secondary index after the table is created
B. Use a Scan with ConsistentRead set to true
C. Keep a second table with the other sort key and update it from application code
D. Define a local secondary index when the table is created

A is the trap. A GSI can be added later, but it can only do eventually consistent reads. B reads the whole table every time, which works and is the most expensive way to do it. C is a lot of code to maintain, and the two tables can drift apart. D is the answer. The table doesn't exist yet, so this is the moment for an LSI.

# Block 10 — Two Bookings for the Same Nine O'Clock

*Objectives: DVA-C03 1.3.4 (conditional writes); 1.3.1 (TTL); 1.1.3 (idempotent writes)*

[SLIDE 2.38]

Here's the everyday version. Two people reach for the last muffin in the bakery case at the same moment. A good cashier doesn't sell it twice. She sells it to whoever paid first and tells the other person, "Sorry, that one's gone." The second person isn't charged and doesn't get half a muffin. Their purchase just doesn't go through.

By default, DynamoDB is not a careful cashier. PutItem with a key that already exists replaces the whole item, and the last writer wins without anyone being told. A condition expression changes that. You attach a condition to a PutItem, UpdateItem or DeleteItem, and DynamoDB checks it against the item as it is right now, in the same step as the write. If the condition is false, nothing is written and you get a ConditionalCheckFailedException. A failed conditional write still consumes write capacity, so it isn't free, but it's correct. The most common condition is attribute_not_exists on the partition key, which means "create this item only if it isn't there yet."

[SLIDE 2.39]

Here's the office. The homeowner portal books inspections into time slots. The slots table has the partition key inspectorId and the sort key slotStart. One afternoon two real estate agents booked Ruth's nine o'clock slot on the same day, a few seconds apart. Both got a confirmation email. The second PutItem quietly replaced the first, and on the morning of the inspection, Ruth showed up at a house that wasn't expecting her. Dana added the condition attribute_not_exists(inspectorId) to the booking write. Now the second agent gets a ConditionalCheckFailedException, and the portal tells them the slot was just taken.

The office staff had a related problem with job notes. Two people opened the same job, both edited the notes, and whoever saved second wiped out the other's changes. The fix is optimistic locking. Each item carries a version number. When you save, you write version plus one with the condition that the version is still the number you read. If someone saved in between, your condition fails, and you re-read the item and merge, instead of overwriting their work. You'll do exactly this in the lab.

Booking also changes the inspector's job count for the day, which can't go over six. Those two writes have to succeed or fail together. That's TransactWriteItems. It groups up to a hundred actions, puts, updates, deletes and condition checks, across one or more tables in the same account and Region, as one all-or-nothing operation, up to four megabytes in total. Each write in a transaction costs two WCUs instead of one. If any condition fails, the whole transaction is canceled with a TransactionCanceledException. And here's the Session 1 callback: a ClientRequestToken makes the transaction idempotent, so if the SDK retries after a timeout within ten minutes, the booking doesn't happen twice.

[SLIDE 2.40]

The last piece is cleanup. While a homeowner pays, the portal holds the slot for fifteen minutes. Dana stores the hold as an item with an expiresAt attribute and turns on Time to Live, TTL, for that attribute. DynamoDB deletes expired items in the background for free, with no write capacity used. Two details matter. The TTL attribute must be a Number holding a Unix epoch time in seconds, and Dana's first version stored an ISO date string, which TTL quietly ignores. And TTL deletes expired items typically within a few days, not at the second they expire. Until then, expired items still show up in reads, so the booking condition has to treat a hold whose expiresAt is in the past as no hold at all.

Here's the trap. A question says expired items are still showing up, and one choice offers a setting to make TTL delete faster. It sounds like the obvious fix. But there's no such setting. TTL is best effort, so your code filters out expired items itself.

[SLIDE 2.41]

Let's try one, and this one is a choose two. A booking system stores a fifteen-minute hold on a time slot as an item with an expiresAt attribute, and TTL is enabled on expiresAt. The application writes expiresAt as an ISO 8601 string. Hours later, the holds still exist and still block new bookings. Which two changes should the developer make? Choose two.

A. Lower the table's TTL deletion delay to fifteen minutes
B. Store expiresAt as a Number holding Unix epoch time in seconds
C. Read the holds with strongly consistent reads
D. Treat holds whose expiresAt is earlier than the current time as expired in the booking condition
E. Turn on DynamoDB Streams for the table

A is the trap. There's no TTL delay setting to lower. C makes the read fresher, but a fresh read of an expired hold is still a hold. E sends changes to other code, but it doesn't delete anything or change the booking rule. B fixes the format, so TTL starts deleting the holds at all. D makes the booking correct during the days before TTL gets around to deleting them. The answers are B and D.

# Block 11 — Streams, and the Upload That Broke Overnight

*Objectives: DVA-C03 1.3.4 (DynamoDB Streams); 1.1.8 preview (event-driven); 2.1.4 (presigned URLs); 4.1 preview (troubleshooting)*

[SLIDE 2.42]

Here's the everyday version of a stream. Your bank sends a text every time your card is charged. You didn't ask the bank to call you about each purchase. You turned on alerts once, and now every change to your account comes to you in order, within seconds.

DynamoDB Streams is that alert feed for a table. When you turn it on, every insert, update and delete becomes a stream record, in order for each item, kept for twenty-four hours. You choose the view type: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, or NEW_AND_OLD_IMAGES, which gives you the item before and after the change. A Lambda function can read the stream through an event source mapping, which you'll build in Session 3. Dana now sends the "your report is ready" email from a function that watches for the status changing to COMPLETE, instead of from the phone app. And TTL deletes show up in the stream too, marked as deleted by the service, which is how you archive expired items before they're gone. Keep the two kinds of events straight. S3 event notifications tell you an object was created or deleted in a bucket. DynamoDB Streams tells you an item changed in a table, and with NEW_AND_OLD_IMAGES it tells you exactly what changed. If a question asks how to react to changes in a table without changing the code that writes to it, I'd look for Streams with a Lambda function first.

[SLIDE 2.43]

Now a full ticket, using the method from Session 1. Here's the ticket. "Since this morning, every photo upload from the phone app fails. S3 returns a 400 error whose message says the checksum doesn't match. Nobody changed the upload code."

Step one, read the whole error. It doesn't say AccessDenied, and it doesn't say SignatureDoesNotMatch or that the request expired. It's about a checksum. So this isn't permissions, the clock or the expiry, which rules out half of what people try first.

Step two, who signed? The backend still signs with the same role, and its policy didn't change, so there's no reason to touch IAM.

Step three, what changed? The answer was in the pull request merged the night before. A routine dependency update moved the SDK for JavaScript to a much newer version. Since early 2025, the SDK calculates a CRC32 checksum for uploads by default. When it signs a normal upload, it has the file in hand, so the checksum is right. When it presigns a PUT, it doesn't have the file yet. It signs a checksum for an empty body and adds parameters starting with x-amz-checksum to the URL. The phone then uploads a real photo, and S3 rejects it because the data doesn't match the checksum in the URL. Dana opened one of the new URLs and saw x-amz-checksum-crc32 sitting in it.

Step four, the smallest fix. On the S3 client that creates the URLs, set requestChecksumCalculation to WHEN_REQUIRED, so the SDK adds a checksum only where S3 requires one. That's one line, and it's the same line in your lab script tonight.

[SLIDE 2.44]

Here's the trap. A question describes presigned uploads that suddenly fail, and one choice says to add s3:PutObject to the signer's role. It feels safe, because missing permissions are the most common reason a presigned URL fails. But the error message settles it. A permissions problem says AccessDenied. This one names a checksum, and the only thing that changed was the SDK.

[SLIDE 2.45]

Let's try one. After a dependency update, presigned PUT URLs created with the AWS SDK for JavaScript version three now include x-amz-checksum parameters, and every upload fails with a 400 error saying the checksum doesn't match. The signing code and IAM policies didn't change. What should the developer do?

A. Add the s3:PutObject permission to the IAM role that signs the URLs
B. Increase expiresIn on the presigned URLs to the seven-day maximum
C. Set requestChecksumCalculation to WHEN_REQUIRED on the signing client
D. Turn on versioning on the bucket

A is the trap. It's the right fix for an AccessDenied, and this error isn't AccessDenied. B would help an expired URL, and the error doesn't say expired. D has nothing to do with checksums. C is the answer. It stops the SDK from signing an empty-body checksum into URLs for files it hasn't seen.

# Closing — Lab Handoff

*Objectives: Lab readiness · Break 2 follows this section, then the lab begins*

[SLIDE 2.46]

Here's what happens next. We're taking our second ten-minute break, and then you'll go to your breakout room with your group. Everything is on the Session 2 Lab page in Moodle. Download the lab files first.

You'll work in CloudShell in your own account, as your admin user, in us-east-1. Part one, create the DynamoDB table and its index first, so the index is ready by the time you need it. Part two, make a bucket, turn on versioning, add the lifecycle rule, then overwrite and delete a file and watch the delete marker appear. Part three, create a presigned PUT URL, upload with curl, then break it on purpose with the wrong Content-Type, and watch a sixty-second download link expire. Part four, run the items script: Query, Scan, the index, a conditional write and optimistic locking, with the capacity of every call shown. Turn on TTL. Part five, delete the bucket with the clean-up script, and keep the table, because Session 3 writes to it.

Then the worksheet: pick keys for three access patterns, do the capacity math for two read loads, and answer the check-first ticket. You've got fifty minutes after the break. Before next session, do the twelve-question quiz and the three reflections in Moodle. See you in the breakout rooms.

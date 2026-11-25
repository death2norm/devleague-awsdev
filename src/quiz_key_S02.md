# AWS Developer Session 02 Quiz: Instructor Key and Trap Breakdown

*Internal only. Students see the same feedback in Moodle after each attempt.*

## Q1. Archive read now and then (D1)
A company must keep scanned contracts for one year. They are rarely opened, but when a lawyer asks for one it must open in the browser immediately. Which S3 storage class is the most cost-effective choice?
- **Correct:** S3 Glacier Instant Retrieval
- **Planted trap:** S3 Glacier Deep Archive
- **Why it's wrong:** Deep Archive is the cheapest to store, but a standard restore takes up to 12 hours, so the contract can't open immediately.

## Q2. Report deleted by mistake (D1)
Versioning is enabled on an S3 bucket. A user runs aws s3 rm on a report without a version ID, and the report no longer appears in listings. How can the developer bring back the report?
- **Correct:** Delete the delete marker that the rm command created
- **Planted trap:** Turn versioning off so the previous version becomes current
- **Why it's wrong:** Versioning can only be suspended, never turned off, and suspending it doesn't remove the delete marker.

## Q3. Nobody may delete early (D1)
A regulator requires that audit files in S3 cannot be deleted or overwritten by anyone, including administrators and the root user, for five years. What should the developer configure?
- **Correct:** S3 Object Lock in compliance mode with a five-year retention period
- **Planted trap:** S3 Object Lock in governance mode with a five-year retention period
- **Why it's wrong:** In governance mode, users with the s3:BypassGovernanceRetention permission can still delete or shorten the retention.

## Q4. Browser upload, no server hop (D2)
A web application lets users upload videos of up to 2 GB. The developer wants the browser to send each file directly to a private S3 bucket without passing through the application servers and without giving users AWS credentials. Which approach meets these requirements with the least operational overhead?
- **Correct:** Have the backend return a presigned PUT URL for each upload
- **Planted trap:** Make the bucket public for writes and let the browser call PutObject
- **Why it's wrong:** A publicly writable bucket lets anyone on the internet upload anything, which is never acceptable.

## Q5. Paid course videos (D2)
A training company serves paid video courses through Amazon CloudFront from a private S3 bucket. Each course has hundreds of video segment files. Only signed-in, paying customers may watch, and the player's existing URLs must not change. What should the developer use?
- **Correct:** CloudFront signed cookies
- **Planted trap:** S3 presigned URLs generated for every segment file
- **Why it's wrong:** That changes every URL the player uses and bypasses CloudFront, and the bucket should stay reachable only through CloudFront.

## Q6. True about GSIs (D1, choose 2)
A developer is deciding whether to add a global secondary index (GSI) to an existing DynamoDB table. Which two statements about GSIs are true? Choose two.
- **Correct:** A GSI can be added to a table that already exists + Reads from a GSI are eventually consistent
- **Planted trap:** A GSI must use the same partition key as the base table
- **Why it's wrong:** That describes a local secondary index. A GSI can have its own partition key and sort key.

## Q7. Transactional read capacity (D1)
A checkout service calls TransactGetItems to read 10 items in every second of peak traffic, and each item is 3 KB. How many read capacity units does the table need for these reads?
- **Correct:** 20
- **Planted trap:** 10
- **Why it's wrong:** That treats each read as a normal strongly consistent read. Transactional reads cost twice as much.

## Q8. Projection didn't cut the bill (D4)
A developer adds a projection expression to a Query so that it returns only two small attributes from each 8 KB item. The response is much smaller, but the consumed read capacity doesn't change. Why?
- **Correct:** Capacity is based on the size of the items read, not the attributes returned
- **Planted trap:** Projection expressions only work on Scan operations
- **Why it's wrong:** Projection expressions work on Query, Scan and GetItem, and they did shrink the response here.

## Q9. Unique username (D1)
A sign-up service stores users in a DynamoDB table with the partition key username. Two people sometimes try to register the same username at the same moment, and the second registration overwrites the first. What should the developer do?
- **Correct:** Add the condition attribute_not_exists(username) to the PutItem
- **Planted trap:** Call GetItem first and skip the PutItem if the username exists
- **Why it's wrong:** Another request can write between the GetItem and the PutItem, so both sign-ups can still succeed.

## Q10. Lost edits (D1)
Two support agents edit the same customer record in a DynamoDB table. Each item has a numeric version attribute. The developer updates with SET version = version + 1 and the condition version = :expected. One agent's save fails with ConditionalCheckFailedException. What should the application do?
- **Correct:** Read the item again, apply the agent's change to the new version, and retry
- **Planted trap:** Retry the same update with the same expected version
- **Why it's wrong:** The version has already changed, so the same condition fails every time.

## Q11. Before and after an update (D1)
A developer enables DynamoDB Streams on an orders table. A Lambda function must compare each order's status before and after every update. Which stream view type should the developer choose?
- **Correct:** NEW_AND_OLD_IMAGES
- **Planted trap:** NEW_IMAGE
- **Why it's wrong:** NEW_IMAGE shows the item only after the change, so there's nothing to compare it with.

## Q12. True about presigned URLs (D2, choose 2)
A developer creates S3 presigned GET URLs with the AWS SDK. Which two statements about these URLs are true? Choose two.
- **Correct:** Anyone who has the URL can use it until it expires + A URL signed with temporary credentials stops working when they expire
- **Planted trap:** The person using the URL must sign in to AWS first
- **Why it's wrong:** The signature is in the URL, so the person using it needs no AWS credentials at all.

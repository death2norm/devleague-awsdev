# AWS Developer Session 2 Lab: Storing Data in S3 and DynamoDB

*50 minutes in your breakout room · your own AWS account · AWS CloudShell · lab files: AWSDev_S02_LabFiles.zip on this page*

## Before You Start

- Sign in to the AWS console as your **admin user, not the root user**, and pick **US East (N. Virginia) us-east-1** in the Region menu.
- Everything tonight fits in the free plan: a few small S3 objects and an on-demand DynamoDB table with a handful of items. You delete the bucket at the end. **Keep the table: Session 3 writes to it.**
- Each person works in their own account. The group fills in one worksheet together.

## Part 1: The Table Comes First (6 minutes)

The index takes a little while to build, so start it now and let it finish while you work on S3.

1. Open CloudShell. Upload the lab files (**Actions**, **Upload file**, AWSDev_S02_LabFiles.zip), then unpack them and install the SDK packages:

> unzip -o AWSDev_S02_LabFiles.zip && cd lab_S02 && npm install

2. Look at table.json. The partition key is ownerId, the sort key is uploadedAt, and the global secondary index fileKey-index lets you find an upload by its S3 key. Create the table:

> aws dynamodb create-table --cli-input-json file://table.json --query TableDescription.TableStatus

3. Wait until it's ready (this is a waiter, from Session 1), then check the table and the index:

> aws dynamodb wait table-exists --table-name AWSDevFiles
> aws dynamodb describe-table --table-name AWSDevFiles --query "[Table.TableStatus, Table.GlobalSecondaryIndexes[0].IndexStatus, Table.BillingModeSummary.BillingMode]"

4. Write both statuses and the billing mode on your worksheet. Both statuses should be ACTIVE.

## Part 2: Versioning and a Lifecycle Rule (10 minutes)

1. Make a bucket with a name nobody else has, and turn on versioning:

> BUCKET=awsdev-s02-$(aws sts get-caller-identity --query Account --output text)-$RANDOM
> aws s3 mb s3://$BUCKET
> aws s3api put-bucket-versioning --bucket $BUCKET --versioning-configuration Status=Enabled

2. Add the lifecycle rule in lifecycle.json (Standard-IA at 30 days, Glacier Flexible Retrieval at 90, expire at 2,555, old versions gone after 30, unfinished uploads gone after 7), then read it back:

> aws s3api put-bucket-lifecycle-configuration --bucket $BUCKET --lifecycle-configuration file://lifecycle.json
> aws s3api get-bucket-lifecycle-configuration --bucket $BUCKET --query "Rules[0].[ID, Transitions[].StorageClass]"

3. Write a report twice, then delete it without a version ID:

> echo "draft one" > note.txt && aws s3 cp note.txt s3://$BUCKET/reports/note.txt
> echo "final copy" > note.txt && aws s3 cp note.txt s3://$BUCKET/reports/note.txt
> aws s3 rm s3://$BUCKET/reports/note.txt
> aws s3 ls s3://$BUCKET/reports/

4. The listing is empty. Now look at what's really there:

> aws s3api list-object-versions --bucket $BUCKET --prefix reports/ --query "{versions: Versions[].[VersionId, IsLatest], markers: DeleteMarkers[].[VersionId, IsLatest]}"

5. Write how many versions and delete markers you see. Then bring the report back by deleting the delete marker, and read it:

> MARKER=$(aws s3api list-object-versions --bucket $BUCKET --prefix reports/note.txt --query "DeleteMarkers[0].VersionId" --output text)
> aws s3api delete-object --bucket $BUCKET --key reports/note.txt --version-id $MARKER
> aws s3 cp s3://$BUCKET/reports/note.txt -

## Part 3: Presigned URLs (10 minutes)

1. Create a presigned PUT URL for an upload key. The script prints what's inside the URL:

> node s02_presign.mjs put $BUCKET uploads/insp-0142/inspection-note.txt

2. On your worksheet, write X-Amz-Expires and whether X-Amz-Security-Token is present. What does that token tell you about how long the URL can last?
3. Upload the file with curl, the way a phone app would. No AWS credentials are involved. The last line is the HTTP status:

> curl -s -o /dev/null -w "%{http_code}\n" -X PUT -T inspection-note.txt -H "Content-Type: text/plain" "$(cat put_url.txt)"

4. Break it on purpose: send a different Content-Type than the one that was signed, and look at the error code:

> curl -s -X PUT -T inspection-note.txt -H "Content-Type: image/jpeg" "$(cat put_url.txt)" | grep -o "<Code>[^<]*"

5. Create a download link that lasts 60 seconds and use it right away:

> node s02_presign.mjs get $BUCKET uploads/insp-0142/inspection-note.txt 60
> curl -s "$(cat get_url.txt)"

6. Do Part 4 now, and come back after at least a minute. Run the same curl again and write the error code:

> curl -s "$(cat get_url.txt)" | grep -o "<Code>[^<]*"

## Part 4: Items, Query, Scan and Conditions (12 minutes)

1. Run the items script. Each R line is a reading for your worksheet:

> node s02_items.mjs

2. While you read the output, turn on Time to Live for the expiresAt attribute and check it:

> aws dynamodb update-time-to-live --table-name AWSDevFiles --time-to-live-specification "Enabled=true, AttributeName=expiresAt"
> aws dynamodb describe-time-to-live --table-name AWSDevFiles

3. If R5 shows Count 0, run the script again. What does that tell you about the index?
4. Optional: look at one item in DynamoDB's own typed format (the document client hides this):

> aws dynamodb get-item --table-name AWSDevFiles --key file://key.json

## Part 5: Clean Up (3 minutes)

1. Delete the bucket. In a versioned bucket, aws s3 rb --force leaves the old versions behind, so use the script, which deletes every version and delete marker first:

> node s02_cleanup.mjs $BUCKET
> aws s3 ls

2. **Don't delete the table.** Check it's still there:

> aws dynamodb describe-table --table-name AWSDevFiles --query Table.ItemCount

## Part 6: Worksheet (remaining time)

Fill in the Session 2 Lab Worksheet with your group: your readings, keys for three access patterns, capacity math for two read loads, and the check-first ticket. Upload one worksheet per person to this assignment.

## If Something Goes Wrong

- **ResourceInUseException on create-table:** the table already exists (maybe from an earlier try). Skip to step 3 of Part 1.
- **BucketAlreadyExists:** run the BUCKET line again for a new random number.
- **CloudShell timed out:** files survive, variables don't. Run aws s3 ls to find your bucket, then set it again with BUCKET= and the name, and cd ~/lab_S02.
- **The first curl in Part 3 returns 403:** check that you typed the Content-Type header exactly as text/plain, and that less than five minutes have passed (make a new URL if not).
- **If the upload doesn't work:** copy each file from this Moodle page into CloudShell with nano, as in Session 1.
- Stuck for more than 3 minutes? Ask your group, then press Ask for Help in Zoom.

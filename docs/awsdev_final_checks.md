# AWS Developer: Final Checks (platform check in a new free-plan account)

*Each item needs a person in a new free-plan AWS account (browser work is paused until Josh says so). Builds use the fallback until the item is checked. Each session's build chat adds its own section.*

## Session 1

| ID | Check | Expected | Fallback until checked |
|---|---|---|---|
| S01-1 | CloudShell Actions > Upload file accepts AWSDev_S01_LabFiles.zip in us-east-1 | Zip lands in the home folder; unzip works | Lab guide's nano copy-paste steps |
| S01-2 | npm install in lab_S01 (needs internet from CloudShell) | Installs @aws-sdk/client-s3 and client-sts in under a minute | Instructor runs the scripts on screen share; students do Parts 1 and 4 with the CLI only |
| S01-3 | node -v in CloudShell | 18 or later (scripts use ES modules and top-level await) | Same as S01-2 |
| S01-4 | aws configure list in CloudShell: Type column wording | container-role (debrief key says this) | Debrief key wording marked [PLATFORM CHECK]; change it to what's shown |
| S01-5 | node s01_objects.mjs: last [chain] line | remoteProvider::fromHttp/fromContainerMetadata (tested locally against a mock container endpoint, Nov 25) | Debrief key shows the expected output |
| S01-6 | aws s3 mb and aws s3 rb --force on the free plan | Both work; S3 is in the free plan | None needed |

## Session 2

| ID | Check | Expected | Fallback until checked |
|---|---|---|---|
| S02-1 | aws dynamodb create-table --cli-input-json file://table.json (on-demand, GSI fileKey-index), then the table-exists waiter and describe-table | Table and index both ACTIVE within about a minute; billing mode PAY_PER_REQUEST | Lab guide says to wait and run describe-table again; debrief key covers CREATING |
| S02-2 | put-bucket-lifecycle-configuration with lifecycle.json (STANDARD_IA at 30, GLACIER at 90, expire 2,555, noncurrent 30, abort multipart 7) | Accepted; get-bucket-lifecycle-configuration reads it back | None needed (configuration only; nothing transitions during the lab) |
| S02-3 | node s02_presign.mjs put, curl with text/plain; curl with image/jpeg; get URL after 60 seconds | 200; SignatureDoesNotMatch; AccessDenied (Request has expired). Script shows X-Amz-Security-Token present and no x-amz-checksum parameters | Debrief key gives the expected codes (tested against a local S3 mock, Nov 25, which doesn't enforce signatures) |
| S02-4 | node s02_items.mjs: R2, R4 and R7 capacity values | R2 0.5, R4 about 0.5, R7 0.5 and 1 | Debrief key values marked [PLATFORM CHECK] (script tested against a local DynamoDB mock, Nov 25) |
| S02-5 | aws dynamodb update-time-to-live with "Enabled=true, AttributeName=expiresAt" | TimeToLiveStatus ENABLING, then ENABLED | Turn TTL on in the console: table, Additional settings, Time to Live |
| S02-6 | node s02_cleanup.mjs on the versioned bucket | Deletes all versions and the delete marker, then the bucket; AWSDevFiles remains | aws s3api delete-object for each version, then aws s3 rb |

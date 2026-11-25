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

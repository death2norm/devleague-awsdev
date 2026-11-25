# AWS Developer Session 1: Lab Debrief Key

*Instructor and TA only. 20 minutes in the main room after the lab. Call on groups, not individuals, and ask each group which trap they avoided.*

## Expected Lab Readings (Part A)

| Reading | Expected |
|---|---|
| get-caller-identity | The student's 12-digit account and an Arn ending in user/ and their admin user's name. If it ends in :root, they're signed in as root: stop and have them sign in as the admin user next time. |
| aws configure list | CloudShell's credentials come from the container credentials endpoint. The Type column is expected to show container-role [PLATFORM CHECK: confirm the exact wording]. |
| s01_whoami.mjs | Access key starts with ASIA; temporary: true; an expiry time is printed. |
| Last [chain] line | remoteProvider::fromHttp/fromContainerMetadata. The lines before it show the SDK checking the environment, Identity Center, the shared files, credential_process and the token file first, and moving on from each. |
| Pages | 3 pages (2, 2 and 1 keys) because pageSize is 2 and there are 5 objects. |
| Retry, 3 attempts | Attempts 3. Total retry delay is small (tens to a few hundred milliseconds) and different on each run. That difference is the jitter. |
| Retry, 5 attempts | Attempts 5. Total delay usually much larger than with 3, because each wait roughly doubles before the random part is taken. |

Talking point: the error code in Part 3 is ECONNREFUSED, a network error, which the SDK treats as transient and retries. Ask: "Would the SDK retry an AccessDenied the same way?" (No. Request errors aren't retried.)

## Part B: Where the SDK Finds Credentials

| Where the code runs | Chain step | Long-term or temporary |
|---|---|---|
| CloudShell | Container credentials endpoint (the same step ECS uses) | Temporary, from the console user's session |
| Laptop with a named profile | Shared config and credentials files (profiles) | Long-term (an IAM user access key) |
| Lambda | Environment variables: Lambda puts the execution role's temporary keys and session token in AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN | Temporary |
| EC2 with an instance profile | EC2 instance metadata service (the instance role) | Temporary |

Traps to name:
- **Lambda = instance metadata.** Lambda isn't EC2 from the code's point of view. The role's keys arrive in environment variables, the first step of the chain.
- **Laptop = temporary.** Only if the profile uses Identity Center or assumes a role. A plain profile with an access key is long-term.
- **CloudShell = your laptop's credentials.** CloudShell never sees the laptop. It uses the console sign-in.

## Part C: First Moves

| Error | First move |
|---|---|
| Token expired | The credentials were temporary and the session ended. Refresh it (aws sso login for an Identity Center profile). Don't create a long-term key. |
| RequestTimeTooSkewed | Check the machine's clock and time synchronization. Not the key, not the policy. |
| ThrottlingException | Let the SDK back off and retry (more attempts or adaptive mode); reduce the request rate. |
| Must be addressed using the specified endpoint | Set the client's Region to the bucket's Region. Not a permissions problem. |

## Part D: Check-First Ticket

**Answer:** check the Lambda function's **execution role**, not her own permissions. In CloudShell the SDK signed as her admin user. In Lambda the same code signs as the execution role, through the environment variables Lambda sets. Her "full S3 access" belongs to her user, not to the function. Add an identity policy to the execution role that allows s3:PutObject on that bucket (and nothing broader).

Planted trap: "add more permissions to her IAM user" or "put her access key in the function's environment variables." The first doesn't affect the function at all. The second works and is wrong: it puts a long-term key in configuration and ties the function to one person. Session 3 builds a Lambda function with an execution role in the lab.

## Breakout Notes

- **npm install slow or failing:** wait 30 seconds; if it still fails, check that the student is in the lab_S01 folder (pwd). [PLATFORM CHECK: npm install from CloudShell on a new free-plan account.]
- **Upload menu missing or failing:** use the nano fallback on the lab page. [PLATFORM CHECK]
- **Node version:** the scripts need Node.js 18 or later; node -v shows it. [PLATFORM CHECK]
- **Session timed out:** files survive, variables don't. aws s3 ls finds the bucket name.
- **Clean-up:** before closing the rooms, ask every group to confirm aws s3 ls no longer shows their bucket. Leftover buckets cost almost nothing, but the clean-up habit matters from night one.
- **5-minute warning** at 35 minutes. Anyone not done with Part 3 skips to Part 4 (clean-up) and finishes the worksheet as homework.

## Debrief Questions (main room)

1. Which [chain] line did everyone get? Why would a laptop show a different one?
2. Two groups, two retry delays: why aren't they the same? (Jitter.)
3. Part B row 3: who said instance metadata? What would make you pick environment variables?
4. Part D: what would you check first? What's the planted wrong answer?

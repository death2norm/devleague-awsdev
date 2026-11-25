<!-- SLIDE 1.01 -->
:::title
## AWS Developer Session 1
### Credentials, the CLI and the SDK
- **Instructor:** Alfred Rezk
:::

<!-- SLIDE 1.02 -->
## How Every Night Runs
:::horizontal-flow
icons: presentation, coffee, users, message-square, clipboard-check
[Lecture: Two parts, a break between] ---> [Break: Ten minutes] ---> [Lab: Your own AWS account, same group] ---> [Debrief: Which trap did you avoid?] ---> [Homework: Quiz + three reflections]
:::

<!-- SLIDE 1.03 -->
## The Exam: DVA-C03
:::stat-callout
icon: award
### 65 questions · 130 min
- **Label:** Pass: 720 of 1,000
- **Context:** 50 scored, 15 unscored. Multiple choice and multiple response (choose two). Voucher: 55 of 65 on a practice exam.
:::

<!-- SLIDE 1.04 -->
## Tonight: Before Your Code Can Do Anything
:::horizontal-flow
icons: key-round, pen-line, refresh-cw
[Find Credentials: The provider chain] ---> [Sign the Request: Signature Version 4] ---> [Handle Failure: Retries, idempotency, fallbacks]
:::

<!-- SLIDE D01 -->
:::divider
### 01
## The Question Has a Budget
- **Objectives:** Exam skill, 2.1.3
:::

<!-- SLIDE 1.05 -->
## Every Choice Works. One Fits.
:::stat-callout
icon: utensils
### No peanuts · under $15 · ten minutes
- **Label:** The limits decide the answer
- **Context:** AWS questions are full of answers that would work. Pick the one inside the limits the question set.
:::

<!-- SLIDE 1.06 -->
## Scenario, Constraint, Ask
:::two-column
:left-column
### Read the Constraint
icon: list-checks
- **Key Parameter:** Least operational overhead · most cost-effective · choose two
- **Mechanism:** Least overhead = fewest things a human builds, rotates or babysits
:right-column
### The Trap
- **Planted Distractor:** Encrypt the key and script a 30-day rotation
- **Why It Fails:** A rotation script is operational overhead. The question asked for the least of it.
:::

<!-- SLIDE 1.07 -->
## Practice: EC2 Reads from S3
:::stat-callout
icon: circle-question-mark
### Role through an instance profile
- **Label:** Answer: C
- **Context:** Temporary credentials that AWS rotates, found by the SDK with no key handling in code.
:::

<!-- SLIDE D02 -->
:::divider
### 02
## The Bucket Is in Oregon
- **Objectives:** 1.1.5, 2.1.5
:::

<!-- SLIDE 1.08 -->
## AWS Has a Mailing Address
:::horizontal-flow
icons: globe, building, wallet, tag
[Region: us-east-1, us-west-2] ---> [Availability Zone: Separate power and network] ---> [Account: 12-digit number, billing boundary] ---> [ARN: Full address: service, Region, account, resource]
:::

<!-- SLIDE 1.09 -->
## Wrong Region, Not Wrong Permissions
:::two-column
:left-column
### Read the Whole Error
icon: map-pin
- **Key Parameter:** The message names the Region or endpoint it expected
- **Mechanism:** The SDK builds the endpoint from the client's Region
:right-column
### The Trap
- **Planted Distractor:** Attach AmazonS3FullAccess
- **Why It Fails:** Permission failures say AccessDenied (403). Requests sent to the wrong Region need the right Region.
:::

<!-- SLIDE 1.10 -->
## Zone or Region?
:::two-column
:left-column
### Pick the Layer
icon: layers
- **Key Parameter:** One data center fails: spread across Availability Zones
- **Mechanism:** Whole area lost or data residency: that's a Region question
:right-column
### The Trap
- **Planted Distractor:** Use another Region for a single data-center failure
- **Why It Fails:** Availability Zones in one Region already cover a data-center failure
:::

<!-- SLIDE 1.11 -->
## Practice: The Bucket ARN
:::stat-callout
icon: circle-question-mark
### arn:aws:s3:::delivery-receipts
- **Label:** Answer: A
- **Context:** Bucket names are unique across AWS, so the Region and account fields are empty.
:::

<!-- SLIDE D03 -->
:::divider
### 03
## Three Ways In
- **Objectives:** 1.1.5, 2.1.3
:::

<!-- SLIDE 1.12 -->
## One Set of APIs, Three Doors
:::horizontal-flow
icons: mouse-pointer-click, terminal, code
[Console: Explore and set up once] ---> [CLI: Repeatable tasks and scripts] ---> [SDK: Your application's code]
:::

<!-- SLIDE 1.13 -->
## CloudShell
:::stat-callout
icon: square-terminal
### A shell in your browser
- **Label:** Already signed in as you
- **Context:** AWS CLI, Node.js and Python preinstalled. About 1 GB of home storage per Region. No keys, no installs.
:::

<!-- SLIDE 1.14 -->
## Who Is Making the Call?
:::two-column
:left-column
### Match the Door to the Caller
icon: user-round
- **Key Parameter:** Person exploring: console or CloudShell · automating: CLI · software: SDK
- **Mechanism:** CloudShell uses your console sign-in credentials
:right-column
### The Trap
- **Planted Distractor:** Install the CLI and run aws configure with a new key
- **Why It Fails:** Breaks both limits: no installs, no long-term keys. CloudShell is not an app host either.
:::

<!-- SLIDE 1.15 -->
## Practice: No Installs, No Keys
:::stat-callout
icon: circle-question-mark
### Open AWS CloudShell
- **Label:** Answer: D
- **Context:** The CLI runs in the browser with the console sign-in credentials.
:::

<!-- SLIDE D04 -->
:::divider
### 04
## Which Key Did It Use?
- **Objectives:** 2.1.3, 2.1.5, 1.1.5
:::

<!-- SLIDE 1.16 -->
## The Credential Provider Chain (SDK v3, Node.js)
:::horizontal-flow
icons: variable, users, file-text, cog, container, server
[Env Vars: Access key variables] ---> [Identity Center: SSO profile] ---> [Shared Files: Profiles in .aws] ---> [Process, Token: Outside program or web identity file] ---> [Container Endpoint: ECS, CloudShell] ---> [Instance Metadata: EC2 role]
:::

<!-- SLIDE 1.17 -->
## First One Found Wins
:::stat-callout
icon: key-round
### aws sts get-caller-identity
- **Label:** Who am I, in which account?
- **Context:** Stale environment variables beat a carefully built profile. Check the account number before you run anything.
:::

<!-- SLIDE 1.18 -->
## Default Doesn't Mean First
:::two-column
:left-column
### The Order Decides
icon: list-ordered
- **Key Parameter:** Environment variables come before the shared files
- **Mechanism:** A leftover key in a process beats the EC2 instance role
:right-column
### The Trap
- **Planted Distractor:** The default profile is checked first
- **Why It Fails:** Default only means the profile used when you don't name one
:::

<!-- SLIDE 1.19 -->
## Practice: Two Sets of Credentials
:::stat-callout
icon: circle-question-mark
### Environment variables, account A
- **Label:** Answer: B
- **Context:** The SDK takes the first credentials in its order and stops looking.
:::

<!-- SLIDE D05 -->
:::divider
### 05
## The Key in the Public Repository
- **Objectives:** 2.1.3, 2.1.5, 2.1.7
:::

<!-- SLIDE 1.20 -->
## House Key vs. Hotel Key Card
:::two-column
:left-column
### Temporary Credentials
icon: hotel
- **Key Parameter:** STS: AssumeRole, GetSessionToken · key ID usually ASIA + session token
- **Mechanism:** They expire on their own; long-term AKIA keys work until deleted
:right-column
### The Trap
- **Planted Distractor:** Long-term keys are fine if you're careful
- **Why It Fails:** Careful people still push .env files. Give code a role.
:::

<!-- SLIDE 1.21 -->
## A Leaked Key, in Order
:::horizontal-flow
icons: power-off, scroll-text, user-check
[Deactivate: Then delete the key] ---> [Investigate: CloudTrail: what did it do?] ---> [Redesign: Roles and Identity Center]
:::

<!-- SLIDE 1.22 -->
## Cleanup Isn't Containment
:::two-column
:left-column
### Kill the Key
icon: shield-x
- **Key Parameter:** A key that was public is compromised
- **Mechanism:** Bots copy keys within minutes of a push
:right-column
### The Trap
- **Planted Distractor:** Make the repository private
- **Why It Fails:** The key was already copied. Hiding it now protects nothing.
:::

<!-- SLIDE 1.23 -->
## Practice: Choose Two
:::stat-callout
icon: circle-question-mark
### Deactivate the key · use a role
- **Label:** Answer: B and E
- **Context:** One fix now, one fix forever. Choose-two answers often do two different jobs.
:::

<!-- SLIDE D06 -->
:::divider
### 06
## The Clock That Was Twenty Minutes Slow
- **Objectives:** 2.1.5, 1.1.3
:::

<!-- SLIDE 1.24 -->
## Signature Version 4
:::two-column
:left-column
### A Signed, Dated Check
icon: pen-line
- **Key Parameter:** Request + date + Region + service, hashed with your secret key
- **Mechanism:** The secret never travels. AWS repeats the math. Time must be within minutes.
:right-column
### The Trap
- **Planted Distractor:** SignatureDoesNotMatch means the key is compromised
- **Why It Fails:** It means the math didn't match: wrong secret, or a request changed after signing
:::

<!-- SLIDE 1.25 -->
## Same Clock, Two Results
:::horizontal-flow
icons: clock, refresh-cw, link-2-off
[Clock Drifts: Server is 20 min slow] ---> [SDK Upload: Skew error once, then corrected] ---> [Presigned Link: Expired before it was sent]
:::

<!-- SLIDE 1.26 -->
## Read the Error Words
:::two-column
:left-column
### Clock Words Mean Fix the Clock
icon: timer
- **Key Parameter:** RequestTimeTooSkewed · request has expired
- **Mechanism:** Fix time sync; on EC2 use the Amazon Time Sync Service
:right-column
### The Trap
- **Planted Distractor:** Rotate the access key
- **Why It Fails:** A new key signed with the same wrong clock fails the same way
:::

<!-- SLIDE 1.27 -->
## Practice: Dead Links
:::stat-callout
icon: circle-question-mark
### Synchronize the server's clock
- **Label:** Answer: C
- **Context:** The link's time is baked into the URL. Nobody clicking it is running the SDK.
:::

<!-- SLIDE 1.28 -->
:::divider
### 10
## Minute Break. Part 2 Starts After It.
:::

<!-- SLIDE 1.29 -->
## Where We Left Off
:::horizontal-flow
icons: list-checks, map-pin, key-round, pen-line
[The Question: Constraint decides] ---> [The Layers: Region, AZ, account, ARN] ---> [The Chain: First credentials found win] ---> [The Signature: SigV4 and the clock]
:::

<!-- SLIDE D07 -->
:::divider
### 07
## Exactly One Thousand Receipts
- **Objectives:** 1.1.5
:::

<!-- SLIDE 1.30 -->
## SDK for JavaScript v3
:::horizontal-flow
icons: package, settings, send, list, hourglass
[Modular: One package per service] ---> [Client: Region, retries] ---> [Command: Sent with client.send] ---> [Paginator: Every page] ---> [Waiter: Until it's ready]
:::

<!-- SLIDE 1.31 -->
## The Packing Slip Said More
:::stat-callout
icon: receipt
### 1,000 per page
- **Label:** IsTruncated + NextContinuationToken
- **Context:** ListObjectsV2 returns at most 1,000 keys. paginateListObjectsV2 follows the token for you.
:::

<!-- SLIDE 1.32 -->
## Follow the Token
:::two-column
:left-column
### Pages, Not Bigger Pages
icon: files
- **Key Parameter:** Paginators for lists, waiters for resources that take time
- **Mechanism:** A waiter checks the real state and stops when it's ready
:right-column
### The Trap
- **Planted Distractor:** Set MaxKeys to 50,000
- **Why It Fails:** MaxKeys only makes pages smaller. S3 never returns more than 1,000.
:::

<!-- SLIDE 1.33 -->
## Practice: 12,000 Objects
:::stat-callout
icon: circle-question-mark
### paginateListObjectsV2
- **Label:** Answer: A
- **Context:** The paginator follows the continuation token until the last page.
:::

<!-- SLIDE D08 -->
:::divider
### 08
## The Retry Storm
- **Objectives:** 1.1.3, 1.1.5
:::

<!-- SLIDE 1.34 -->
## Which Errors to Retry
:::two-column
:left-column
### Time Fixes Some Problems
icon: refresh-cw
- **Key Parameter:** Retry: throttling (429, ThrottlingException), 5xx, timeouts
- **Mechanism:** Don't retry: AccessDenied, ValidationException, 404
:right-column
### The Trap
- **Planted Distractor:** Retry every error
- **Why It Fails:** 4xx request errors fail the same way every time
:::

<!-- SLIDE 1.35 -->
## Backoff With Jitter
:::horizontal-flow
icons: circle-x, hourglass, shuffle, circle-check
[Throttled: Rate limit hit] ---> [Back Off: Each wait about twice as long] ---> [Jitter: Random part, so callers spread out] ---> [Succeeds: Standard mode, maxAttempts 3 total]
:::

<!-- SLIDE 1.36 -->
## Persistent Isn't Reliable
:::two-column
:left-column
### Let the SDK Retry
icon: gauge
- **Key Parameter:** Standard mode by default; adaptive adds client-side rate limiting
- **Mechanism:** maxAttempts counts the first try
:right-column
### The Trap
- **Planted Distractor:** Retry immediately in a loop until it succeeds
- **Why It Fails:** Immediate retries make throttling worse, and some errors never succeed
:::

<!-- SLIDE 1.37 -->
## Practice: Choose Two
:::stat-callout
icon: circle-question-mark
### 503 and ThrottlingException
- **Label:** Answer: A and D
- **Context:** Server-side errors and throttling can succeed later. Request errors can't.
:::

<!-- SLIDE D09 -->
:::divider
### 09
## Charged Twice for One Burrito
- **Objectives:** 1.1.3
:::

<!-- SLIDE 1.38 -->
## Idempotent
:::stat-callout
icon: arrow-up-down
### Press it five times, get one elevator
- **Label:** Same effect once or many times
- **Context:** Reading and setting are idempotent. Adding to a balance and charging a card are not.
:::

<!-- SLIDE 1.39 -->
## Idempotency Key
:::horizontal-flow
icons: shopping-cart, wifi-off, repeat, shield-check
[One Order: One unique ID] ---> [Response Lost: Client can't tell] ---> [Retry: Same ID sent again] ---> [No Double Charge: Server returns the first result]
:::

<!-- SLIDE 1.40 -->
## Keep Retries, Make Them Safe
:::two-column
:left-column
### Graceful Degradation Too
icon: life-buoy
- **Key Parameter:** Idempotency keys, client tokens, conditional writes
- **Mechanism:** Short timeout + fallback: show the menu without ratings
:right-column
### The Trap
- **Planted Distractor:** Disable retries in the SDK
- **Why It Fails:** Every network hiccup becomes a failed order
:::

<!-- SLIDE 1.41 -->
## Practice: Duplicate Payments
:::stat-callout
icon: circle-question-mark
### Order ID as an idempotency key
- **Label:** Answer: B
- **Context:** Same ID on every attempt, recorded once, checked every time.
:::

<!-- SLIDE D10 -->
:::divider
### 10
## The Photo That Was Really Text
- **Objectives:** 1.1.7
:::

<!-- SLIDE 1.42 -->
## Packing Data to Travel
:::horizontal-flow
icons: braces, binary, type
[JSON: Text for objects and lists] ---> [Binary: Raw bytes: images, zips] ---> [Base64: Bytes as text, about a third bigger]
:::

<!-- SLIDE 1.43 -->
## Pack and Unpack
:::two-column
:left-column
### SDK v3 Bodies
icon: box
- **Key Parameter:** Upload: string, bytes or stream. JSON.stringify objects first.
- **Mechanism:** Download: Body is a stream. transformToString, then JSON.parse.
:right-column
### The Trap
- **Planted Distractor:** Store the base64 string as the .jpg
- **Why It Fails:** That's the packed box. Buffer.from(text, 'base64') gets the bytes.
:::

<!-- SLIDE 1.44 -->
## Encoding Isn't Encryption
:::two-column
:left-column
### Base64 Has No Key
icon: lock-open
- **Key Parameter:** Base64 fits binary into text formats
- **Mechanism:** Anyone can decode it in one line
:right-column
### The Trap
- **Planted Distractor:** Base64-encode sensitive data to protect it
- **Why It Fails:** It only looks scrambled. Protection needs encryption with keys (Session 7).
:::

<!-- SLIDE 1.45 -->
## Practice: Broken Images
:::stat-callout
icon: circle-question-mark
### Decode the base64 first
- **Label:** Answer: D
- **Context:** The image bytes are inside the base64 string.
:::

<!-- SLIDE D11 -->
:::divider
### 11
## The Assistant Wrote It, You Ship It
- **Objectives:** 1.1.9
:::

<!-- SLIDE 1.46 -->
## Kiro: Spec-Driven Development
:::horizontal-flow
icons: file-text, drafting-compass, list-todo, code, search-check
[Requirements: Stories, acceptance criteria] ---> [Design: Parts and data flow] ---> [Tasks: Numbered plan] ---> [Code: Generated from tasks] ---> [Review: You check it]
:::

<!-- SLIDE 1.47 -->
## What the Review Caught
:::two-column
:left-column
### Steering and Hooks Help
icon: scan-search
- **Key Parameter:** Steering files: standing project rules · hooks: run checks on save
- **Mechanism:** Found: s3:* on *, a retry loop with no wait, a key in a test file
:right-column
### The Trap
- **Planted Distractor:** The tool is from AWS, so it follows best practices
- **Why It Fails:** A first draft is a first draft. The developer owns every line.
:::

<!-- SLIDE 1.48 -->
## Green Tests Aren't a Review
:::two-column
:left-column
### You Own What You Ship
icon: user-check
- **Key Parameter:** Review the spec and the diff, scan, apply least privilege
- **Mechanism:** Tests only check what someone thought to test
:right-column
### The Trap
- **Planted Distractor:** Skip review because the unit tests pass
- **Why It Fails:** Tests don't notice a wildcard policy or a pasted key
:::

<!-- SLIDE 1.49 -->
## Practice: Before You Deploy
:::stat-callout
icon: circle-question-mark
### Review and security-scan the code
- **Label:** Answer: C
- **Context:** Read it, scan it, fix it. You own it in production.
:::

<!-- SLIDE D12 -->
:::divider
### 12
## Ticket: It Worked Yesterday
- **Objectives:** 2.1.3, 2.1.5
:::

<!-- SLIDE 1.50 -->
## The Ticket Method
:::horizontal-flow
icons: triangle-exclamation-point, user-search, clock-arrow-left, wrench
[Read the Error: All of it] ---> [Who Am I?: get-caller-identity, which chain step] ---> [What Changed?: Code, config or time] ---> [Smallest Fix: Matches the words]
:::

<!-- SLIDE 1.51 -->
## The Session Ended
:::two-column
:left-column
### Hotel Key Card, Working as Designed
icon: hotel
- **Key Parameter:** Token expired: run aws sso login for the profile
- **Mechanism:** No code changes, no new keys, no new permissions
:right-column
### The Trap
- **Planted Distractor:** Create a long-term access key so it stops breaking
- **Why It Fails:** The expiration is the security feature, not the bug
:::

<!-- SLIDE 1.52 -->
## Practice: Expired Token
:::stat-callout
icon: circle-question-mark
### aws sso login
- **Label:** Answer: A
- **Context:** The session expired, so start a new one.
:::

<!-- SLIDE 1.53 -->
## Lab: CloudShell, Your Own Account
:::horizontal-flow
icons: user-check, database, refresh-cw, trash, clipboard-check
[Who Am I: CLI and SDK] ---> [Objects: Put, get, paginate] ---> [Retries: Attempts and delay] ---> [Clean Up: Delete your bucket] ---> [Worksheet: Four setups, one ticket]
:::

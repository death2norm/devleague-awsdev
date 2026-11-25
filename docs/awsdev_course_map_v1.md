# DevLeague AWS Developer (DVA-C03) · Course Map v1.0 (draft, Nov 25, 2026)

*Built from the shared kit (Production Standard v5) and the agenda in the project doc `claude/alfred_courses_pdf/plan.html`. Same night model, script rules, file set and QA gates as Security+ and Network+; only the values below change. Status: Week 1 specs written; independent review next, then Josh approves. Weeks 2–4 are listed in section 3 and get full specs one week at a time.*

## 1. Course constants

| Item | Value |
|---|---|
| Exam | AWS Certified Developer – Associate **DVA-C03** (live from Dec 1, 2026; DVA-C02 retired after Nov 30, 2026). 65 questions (50 scored), 130 minutes, scaled 100–1,000, pass 720, multiple choice and multiple response, compensatory scoring. $150; 14-day wait between attempts; valid 3 years |
| Prefix | AWSDev_S## |
| Instructor | Alfred Rezk (instructor-neutral scripts; any qualified instructor can deliver). Alfred passes DVA-C03 before launch |
| Brand, palette, fonts | Same as Security+ |
| Pace | 130 wpm |
| Schedule | 3 sessions a week, **12 sessions over 4 weeks**, 1-hour Week 0 orientation |
| Cohort | 20–30, breakout groups of 4–5, TA co-host |
| Voucher | **56 of 65** on Practice Exam B, C or D (proposed Nov 25, same 86% as 77 of 90; Josh to confirm). Go by the 56 |
| Voucher cost | $150 (budget a second attempt for about 35% of students). Whether AWS lets DevLeague include the exam in its price is unconfirmed (Josh) |
| LMS | learn.devleague.com, Moodle 4.5, Moove theme. New course shell copied from course 43's structure |
| Code language | JavaScript (Node.js 22) with AWS SDK for JavaScript v3. The exam is language-neutral; scripts say so once in Session 1 |
| Labs | Each student's own AWS account on the **free plan** (new accounts: $100 at sign-up plus up to $100 more earned by trying services, 6 months, no charges, selected services only). Labs run in **AWS CloudShell** in the console, so no local install or access keys are needed. Students with an older account (no free plan) follow the same labs on a paid account with a $10 budget alarm; budget about $20 each. Every lab ends with a clean-up step |
| Lab platform check | Before scripts: a person runs each Week's labs in a new free-plan account (Josh creates it when Week 1 specs are approved) and records which services the free plan allows, especially CodePipeline, ECS/Fargate and Bedrock. Anything not allowed gets an instructor-demo fallback in `docs/awsdev_final_checks.md` |

## 2. Exam domains and weights

See `docs/objectives_DVA-C03.md`. Practice exams draw **20 / 17 / 14 / 14** by domain (65 items). The exam has no PBQs; its special format is **multiple response** ("choose two"), practiced from Session 1 and drilled in Session 11. Troubleshooting and optimization (22%) is built into every lab: each ends with a "what would you check first" ticket, and from Session 3 on the ticket names the log, metric or error message to look at.

## 3. Course map

| # | Session | Exam tasks | Lab | Lab source |
|---|---|---|---|---|
| 0 | Week 0 orientation (1 hour) | — | — | Free-plan account, budget alarm, CloudShell check, warm-up quiz |
| 1 | AWS for Developers: Credentials, the CLI and the SDK | 1.1.3 1.1.5 1.1.7 1.1.9 2.1.3 2.1.5 | M | CloudShell: CLI, SDK v3 script on S3 |
| 2 | Storing Data: S3 and DynamoDB | 1.3.1 1.3.4 2.1.4 | L | CloudShell: lifecycle rule, presigned upload, DynamoDB table and index |
| 3 | AWS Lambda | 1.2.1–1.2.4 3.3.1 | L | Lambda triggered by S3 upload, writing to DynamoDB; failure destination |
| 4 | APIs, Events and Messaging | 1.1.1 1.1.2 1.1.4 1.1.6 1.1.8 1.1.10 3.1.5 | M | API Gateway REST API → Lambda → SQS; one Bedrock call (fallback: demo) |
| 5 | Speed and Scale | 1.3.2 1.3.3 4.3.1–4.3.6 | M | Add caching and tune Lambda memory, measure before and after |
| 6 | Identity and Access for Applications | 2.1.1 2.1.2 2.1.6 2.1.7 | M | Cognito user pool sign-in on the API; assume a role |
| 7 | Encryption, Secrets and AI Security | 2.2.1–2.2.7 2.3.1–2.3.5 | L | Secrets Manager + KMS; Bedrock call behind a guardrail (fallback: demo) |
| 8 | Packaging and Testing | 3.1.1–3.1.4 3.2.1–3.2.5 | L | SAM template, test events, Lambda alias, AppConfig |
| 9 | Deploying with CI/CD | 3.3.2–3.3.9 | L | CodePipeline from GitHub to Lambda with a canary (fallback: demo) |
| 10 | Troubleshooting and Observability | 4.1.1–4.1.5 4.2.1–4.2.5 | L | Break-and-fix: three planted faults; Logs Insights, X-Ray, custom metric |
| 11 | Review by Weight + Multiple-Response Workshop | All | M | Group scenario rounds; Practice Exam A weak spots |
| 12 | Timed Practice Exam B + Readiness | All | Special | Moodle practice exam |

**Session 12 timing (special, needs a kit change):** briefing 10 · Practice Exam B 130 min (20/17/14/14, camera on) · break 10 · review 25 · close 5. `build_s18.sh` and `s18_timing.py` assume a 90-minute exam and Session 18; adapt them (or a course override) when Session 12 is built.

## 4. Settled
1. 12 sessions over 4 weeks (Nov 25 proposal). Moodle course has 14 sections: Start Here, Sessions 01–12, Practice Exams, Course Resources (adjust the playbook's 20-section layout).
2. Labs in CloudShell on the student's own free-plan account; no TryHackMe and no Packet Tracer.
3. Moodle structure, practice-exam groups, handout and run-sheet tools same as Security+, with 65-item practice exams of 130 minutes.

## 5. Week 0 orientation
Create an AWS account on the free plan (or confirm an existing one and set a $10 budget alarm) · turn on MFA for the root user and sign in as an admin user, not root · open CloudShell and run `aws sts get-caller-identity` · how the free plan's credits and 6-month limit work, and the clean-up habit · how to read an AWS question ("least operational overhead," "most cost-effective," choose two) · 10-question warm-up.

## 6. Multiple-response practice (instead of PBQs)
Every session's practice questions include at least two "choose two" items. Session 11 workshop rounds: choose-two and choose-three items, "least operational overhead" vs "most cost-effective" wording, service-picking from a scenario, reading an error message or log line and picking the fix.

## 7. Assessments
Nightly quiz 10 (12 where coverage needs it), including at least two multiple-response items (GIFT supports them with weighted answers; the kit's `gift.py` doesn't yet, so it needs a small change before Session 1 is built). Unlimited attempts, trap feedback. Practice bank **30 per session for Sessions 1–10 and 25 for Session 11 ≈ 325** (four sealed pools of 65 need 260 at least), tagged by domain and task. Practice Exams A (diagnostic before Week 4), B (Session 12 live), C and D (retakes).

| | D1 | D2 | D3 | D4 |
|---|---|---|---|---|
| Target (of 325, by weight) | 98 | 85 | 71 | 71 |
| Planned | 100 | 85 | 71 | 69 |

Per session: S1 D1 20 D2 10 · S2 D1 22 D2 8 · S3 D1 25 D3 3 D4 2 · S4 D1 25 D3 5 · S5 D1 8 D4 22 · S6 D2 30 · S7 D2 30 · S8 D3 30 · S9 D3 30 · S10 D4 30 · S11 D2 7 D3 3 D4 15.

## 8. Week 1 specs (v1, for review)

### Session 1: AWS for Developers: Credentials, the CLI and the SDK · 1.1.3 1.1.5 1.1.7 1.1.9 2.1.3 2.1.5 · Lab M
- **Lab (40 min):** in CloudShell, run `aws sts get-caller-identity`, make an S3 bucket with the CLI, then write and run a Node.js script (SDK v3) that puts and gets an object and lists with pagination; turn on the SDK's retry logging and read one retry. Clean up the bucket. **Artifact:** fill in where the SDK found its credentials in four setups (CloudShell, laptop with a profile, Lambda, EC2), in provider-chain order.
- **Check-first ticket:** the script works in CloudShell but gets AccessDenied when the same code runs in Lambda → look at the function's execution role, not your own permissions.
- **Blocks (12):** 1 how AWS questions are written: scenario, "least operational overhead," choose two · 2 Regions, Availability Zones, accounts, ARNs, service endpoints · 3 three ways in: console, CLI, SDK; CloudShell · 4 the credential provider chain: environment variables, shared config and profiles, IAM Identity Center sign-in, container and instance roles · 5 long-term vs temporary credentials; never put keys in code; roles for code; STS · 6 what an authenticated call is: Signature Version 4, request signing, clock skew errors · 7 SDK v3 for JavaScript: clients, commands, async/await, paginators, waiters · 8 errors: 4xx vs 5xx, throttling, exponential backoff with jitter, SDK retry modes (standard, adaptive) · 9 idempotency and graceful degradation (retry-safe writes, fallbacks) · 10 serializing data: JSON, base64, binary bodies, streams · 11 AI coding assistants (Kiro): spec-driven code generation, review and security scanning, and checking what the assistant wrote · 12 full ticket walkthrough.
- **Break 1** after Block 6. **Callbacks:** none (first session). **Practice bank:** D1 20, D2 10.
- **Exam terms:** Region, Availability Zone, ARN, endpoint, CloudShell, AWS CLI, SDK, credential provider chain, profile, access key, temporary credentials, STS, IAM Identity Center, execution role, Signature Version 4, paginator, waiter, throttling, exponential backoff, jitter, idempotent, graceful degradation, serialization, base64, Kiro, spec-driven development.

### Session 2: Storing Data: S3 and DynamoDB · 1.3.1 1.3.4 2.1.4 · Lab L
- **Lab (50 min):** in CloudShell: bucket with a lifecycle rule (move to Glacier, expire old versions); generate a presigned PUT URL in Node.js and upload a file with `curl`; create a DynamoDB table (partition and sort key), write items, run a Query and a Scan with consumed capacity shown, add a GSI and a TTL attribute. Clean up. **Artifact:** pick the partition and sort key for three access patterns, and work out RCUs for two read loads.
- **Check-first ticket:** an item written a moment ago is missing from a Query on a GSI → GSIs are eventually consistent only; read the base table with ConsistentRead or wait.
- **Blocks (12):** 1 S3: buckets, keys, prefixes, storage classes · 2 lifecycle rules, versioning, Glacier, retention · 3 presigned URLs: GET vs PUT, expiry, they carry the signer's permissions · 4 S3 event notifications (preview of Session 4) · 5 DynamoDB: tables, items, attributes, partition and sort keys · 6 high-cardinality keys and hot partitions · 7 capacity: on-demand vs provisioned, RCU and WCU math · 8 read consistency: eventually vs strongly consistent; GSIs eventual only · 9 Query vs Scan, filter and projection expressions, pagination · 10 LSI vs GSI · 11 TTL, conditional writes, optimistic locking with a version attribute, transactions · 12 DynamoDB Streams (preview of Session 3) and full ticket.
- **Break 1** after Block 6. **Callbacks:** Session 1 paginators and signed calls (presigned URLs are signed calls handed to someone else). **Practice bank:** D1 22, D2 8.
- **Exam terms:** bucket, object key, prefix, storage class, lifecycle rule, versioning, S3 Glacier, presigned URL, event notification, partition key, sort key, composite primary key, hot partition, on-demand, provisioned capacity, RCU, WCU, eventually consistent read, strongly consistent read, Query, Scan, filter expression, projection expression, LSI, GSI, TTL, conditional write, optimistic locking, transaction, DynamoDB Streams.

### Session 3: AWS Lambda · 1.2.1–1.2.4 3.3.1 · Lab L
- **Lab (50 min):** a Node.js Lambda function runs on each S3 upload and writes the file's details to the Session 2 table; set an environment variable, memory and timeout; send a bad file so the function fails and the event lands in an on-failure destination (SQS); find the error in CloudWatch Logs. Clean up. **Artifact:** pick memory, timeout and concurrency settings for three workloads and say which invocation type each uses.
- **Check-first ticket:** after the function is put in a VPC to reach a database, its calls to S3 start timing out → private subnets have no route out; add an S3 gateway endpoint (or a NAT gateway).
- **Blocks (12):** 1 what Lambda is: execution environment, cold vs warm start · 2 handler, event and context; set-up code outside the handler · 3 configuration: memory and CPU, timeout (15 minutes max), ephemeral storage, environment variables · 4 invocation types: synchronous, asynchronous, event source mapping · 5 permissions: execution role vs resource-based policy · 6 errors and retries: asynchronous retries, destinations vs dead-letter queues, event source mapping batch failures and partial batch responses · 7 concurrency: reserved vs provisioned, throttling · 8 runtimes, layers, extensions; packaging as .zip or container image, size limits · 9 VPC access: network interfaces in private subnets, VPC endpoints or NAT for outbound calls · 10 versions and aliases (preview of Session 8) · 11 idempotent handlers and calling other services from code · 12 full ticket walkthrough.
- **Break 1** after Block 6. **Callbacks:** Session 1 execution role and retries; Session 2 S3 events and the table. **Practice bank:** D1 25, D3 3, D4 2.
- **Exam terms:** execution environment, cold start, handler, event object, context object, timeout, ephemeral storage, environment variable, synchronous invocation, asynchronous invocation, event source mapping, execution role, resource-based policy, destination, dead-letter queue, partial batch response, reserved concurrency, provisioned concurrency, throttling, runtime, layer, extension, deployment package, container image, ENI, VPC endpoint, NAT gateway, version, alias.

## 9. Weeks 2–4
Specs written one week at a time after Week 1 is approved (same template). Notes carried forward: Session 4 uses Kinesis and Data Firehose for 1.1.6; Session 7 carries Alfred's injection and XSS material into the AI-security and input-handling blocks; Session 9 uses GitHub as the source (CodeCommit availability for new accounts to be confirmed); Session 10's faults must be reproducible in a free-plan account.

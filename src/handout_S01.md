# AWS Developer Session 1: Credentials, the CLI and the SDK

*How your code finds credentials, signs requests and survives failures*

## Read the Question

- **Scenario, constraint, ask.** The constraint decides: *least operational overhead* (fewest things a human builds, rotates or watches), *most cost-effective*, *most secure*.
- **Choose two:** no partial credit. The two right answers often do different jobs (one fix now, one fix for good).
- **Exam:** 65 questions (50 scored), 130 minutes, pass 720 of 1,000. Voucher: 55 of 65 on a practice exam.

## Where Things Live

- **Region** (us-east-1) holds most resources; **Availability Zones** are separate data centers inside it.
- **Account:** 12-digit number. **ARN:** arn:partition:service:region:account:resource.
- Bucket ARN: `arn:aws:s3:::name` (no Region, no account). IAM ARNs have no Region.
- An error that names another **Region or endpoint** is not a permissions problem. Fix the client's Region.

## The Credential Provider Chain (SDK v3, Node.js)

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`)
2. IAM Identity Center (SSO) profile
3. Shared config and credentials files (profiles)
4. `credential_process`, then a web identity token file
5. Container credentials endpoint (ECS, CloudShell)
6. EC2 instance metadata (instance role)

**First one found wins.** "Default profile" does not mean first. Check with `aws sts get-caller-identity`.

## Long-Term vs. Temporary

- **Long-term:** IAM user key (usually AKIA...), works until deleted.
- **Temporary (STS):** key (usually ASIA...) + secret + **session token**, expires on its own. AssumeRole, GetSessionToken.
- Code gets a **role**: EC2 instance profile, Lambda execution role, ECS task role. People use Identity Center.
- **Leaked key:** deactivate and delete it first; a private repo doesn't un-leak it. Then use a role.

## Signed Requests (SigV4)

- Request + time + Region + service, hashed with the secret. The secret never travels.
- **SignatureDoesNotMatch:** wrong secret or changed request. **Token expired:** refresh the session (`aws sso login`).
- **Time skewed / request expired:** fix the clock. The SDK corrects its own skew and retries once; a presigned URL can't.

## The SDK for JavaScript v3

- One package per service; `client.send(new PutObjectCommand(input))` returns a promise, so `await` it.
- **Paginators** follow the continuation token (S3 lists max 1,000 keys per page). **Waiters** poll until a resource is ready, instead of a fixed sleep.
- Turn on `logger: console` to see each step of the credential chain.

## Errors and Retries

- **Retry:** throttling (429, ThrottlingException), 5xx, timeouts. **Don't:** AccessDenied, ValidationException, 404.
- **Standard** mode (default): exponential backoff + jitter, `maxAttempts` 3 counting the first try. **Adaptive** adds client-side rate limiting.
- **Idempotent:** same effect once or many times. Use an idempotency key or client token so a retry can't charge twice.
- **Graceful degradation:** short timeout + fallback for optional features.

## Data and AI Tools

- Upload Body: string, bytes or stream (`JSON.stringify` objects). Download Body: a stream (`transformToString`, then `JSON.parse`).
- **Base64** = binary as text, about a third bigger. Encoding, not encryption.
- **Kiro, spec-driven:** requirements, design, tasks reviewed before code; steering files and hooks. You still review and scan what it writes.

## Homework

- Session 1 quiz (12 questions) and three reflections in Moodle before next session.

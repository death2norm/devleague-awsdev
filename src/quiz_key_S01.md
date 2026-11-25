# AWS Developer Session 01 Quiz: Instructor Key and Trap Breakdown

*Internal only. Students see the same feedback in Moodle after each attempt.*

## Q1. Credentials for a container (D2)
A Node.js application runs as a task on Amazon ECS and must write objects to one S3 bucket. The company wants each task to have only the permissions it needs and does not allow long-term access keys. How should the application get credentials?
- **Correct:** Give the ECS task an IAM task role with access to the bucket
- **Planted trap:** Put an access key in the Dockerfile as environment variables
- **Why it's wrong:** That bakes a long-term key into the image, where anyone who pulls the image can read it, and the company doesn't allow long-term keys.

## Q2. Just the account number (D1)
A shell script needs to store only the 12-digit account ID of the current credentials in a variable. Which command returns exactly that value?
- **Correct:** aws sts get-caller-identity --query Account --output text
- **Planted trap:** aws sts get-caller-identity --output table
- **Why it's wrong:** A table is easier for a person to read, but it still prints the user ID and ARN along with the account, plus borders.

## Q3. New secret, new error (D2)
A developer pastes a newly created secret access key into a CI system's settings. Every AWS call from the CI job now fails with SignatureDoesNotMatch. The access key ID is correct, and the CI server's clock is accurate. What is the most likely cause?
- **Correct:** The secret key stored in the CI settings is wrong
- **Planted trap:** The CI server's clock is out of sync with AWS
- **Why it's wrong:** Clock problems say the time is skewed or the request expired, and the question says the clock is accurate.

## Q4. Throttled batch job (D1, choose 2)
A batch job that uses the SDK for JavaScript version three receives frequent ThrottlingException errors when many workers run at once. The developer wants the job to finish reliably with the least custom code. Which two actions should the developer take? Choose two.
- **Correct:** Set the client's retryMode to adaptive + Increase maxAttempts on the SDK client
- **Planted trap:** Wrap each call in a loop that retries immediately until it succeeds
- **Why it's wrong:** Immediate retries from many workers keep the rate high and make throttling worse.

## Q5. Table not ready (D1)
A setup script creates a DynamoDB table and then writes the first item. The write sometimes fails with ResourceNotFoundException. What is the most reliable fix?
- **Correct:** Use the waitUntilTableExists waiter before writing
- **Planted trap:** Add a fixed five-second pause before the first write
- **Why it's wrong:** Sometimes five seconds is too short and sometimes it wastes time. A fixed pause guesses instead of checking.

## Q6. Slow recommendations (D1)
A product page calls a separate recommendation service. When that service is slow, the whole page takes 30 seconds to load or fails. Recommendations are useful but not required. What should the developer do?
- **Correct:** Use a short timeout and show default content on failure
- **Planted trap:** Raise the call's timeout to 60 seconds so it always finishes
- **Why it's wrong:** A longer timeout makes the page wait even longer for an optional feature.

## Q7. Reading the body (D1)
A developer uses the SDK for JavaScript version three to download a JSON object with GetObjectCommand. Passing the response's Body directly to JSON.parse throws an error. What should the developer do?
- **Correct:** Read the Body with transformToString, then parse the text
- **Planted trap:** Store the object as base64 so JSON.parse can read it
- **Why it's wrong:** Base64 is an encoding for putting binary data into text. It doesn't change the fact that Body is a stream.

## Q8. Spec before code (D1)
A team adopts Kiro and uses spec-driven development for a new feature. At what point does the developer get the best chance to catch a missing requirement?
- **Correct:** When reviewing the requirements, design and tasks
- **Planted trap:** After the feature is deployed, by reading production logs
- **Why it's wrong:** Logs show what went wrong after users hit it. The point of a spec is to catch gaps before any code exists.

## Q9. Temporary credentials (D2, choose 2)
Which two statements about temporary credentials issued by AWS STS are true? Choose two.
- **Correct:** They include a session token in addition to the access key ID and secret + They expire automatically after a set duration
- **Planted trap:** Their access key IDs begin with AKIA, like IAM user keys
- **Why it's wrong:** AKIA is the usual start of a long-term IAM user key. Temporary access key IDs usually start with ASIA.

## Q10. Safe to repeat (D1)
A developer is deciding which operations can be retried safely without an idempotency key. Which operation is idempotent? (The S3 bucket does not use versioning.)
- **Correct:** Uploading the same file to the same S3 key
- **Planted trap:** Adding 10 to a customer's reward points balance
- **Why it's wrong:** Each retry adds another 10, so doing it twice isn't the same as doing it once.

## Q11. Role ignored (D2)
An application on an EC2 instance gets AccessDenied when it reads from S3, even though the instance role allows it. The application's process has AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY set for an IAM user with no S3 permissions. What should the developer do?
- **Correct:** Remove the access key environment variables from the process
- **Planted trap:** Add more S3 permissions to the instance role
- **Why it's wrong:** The role already allows the read. The SDK never uses the role, because the environment variables are found first.

## Q12. Wrong Region (D1)
A script lists objects in a bucket and fails with an error saying the bucket must be addressed using the specified endpoint. The same IAM user can list the bucket in the console. What should the developer change?
- **Correct:** Set the client's Region to the bucket's Region
- **Planted trap:** Attach a policy that grants s3:ListBucket to the user
- **Why it's wrong:** The user can already list the bucket in the console, and a permissions failure would say AccessDenied.

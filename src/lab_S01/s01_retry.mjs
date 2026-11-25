// DevLeague AWS Developer · Session 1 lab, Part 3: watch the SDK retry.
// This client points at an address where nothing is listening (http://localhost:1), so every
// attempt fails with a connection error. The SDK treats that as a transient error and retries
// with exponential backoff and jitter, up to maxAttempts in total (the first try counts).
// Run: node s01_retry.mjs            (try: node s01_retry.mjs 5   to allow 5 attempts)
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const maxAttempts = Number(process.argv[2] ?? 3);

const broken = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  endpoint: "http://localhost:1",   // nothing listens on port 1
  forcePathStyle: true,
  maxAttempts,                      // total tries, including the first
  retryMode: "standard",            // the default; "adaptive" also slows down to avoid throttling
});

const started = Date.now();
try {
  await broken.send(new ListBucketsCommand({}));
  console.log("Unexpected: the call worked.");
} catch (err) {
  console.log("Error name:       ", err.name);
  console.log("Error code:       ", err.code ?? "(none)");
  console.log("Attempts:         ", err.$metadata?.attempts);
  console.log("Total retry delay:", err.$metadata?.totalRetryDelay, "ms");
  console.log("Wall-clock time:  ", Date.now() - started, "ms");
}

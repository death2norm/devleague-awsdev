// DevLeague AWS Developer · Session 2 lab, Part 3: presigned URLs with the SDK for JavaScript v3.
// Run: node s02_presign.mjs put YOUR-BUCKET uploads/insp-0142/inspection-note.txt
//      node s02_presign.mjs get YOUR-BUCKET uploads/insp-0142/inspection-note.txt [SECONDS]
// The URL is written to put_url.txt or get_url.txt so you can hand it to curl, just as a backend
// hands a URL to a phone app. Whoever holds the URL can use it until it expires.
import { writeFileSync } from "node:fs";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const [mode, bucket, key, extra] = process.argv.slice(2);
if (!["put", "get"].includes(mode) || !bucket || !key) {
  console.error("Usage: node s02_presign.mjs put|get YOUR-BUCKET OBJECT-KEY [SECONDS]");
  process.exit(1);
}

// requestChecksumCalculation "WHEN_REQUIRED": SDK versions from 3.729.0 add a CRC32 checksum to uploads by
// default. For a presigned PUT the SDK can't see the file you'll upload later, so it would sign a checksum
// for an empty body and S3 would reject the real file. WHEN_REQUIRED adds a checksum only where S3 requires one.
// responseChecksumValidation does the same for downloads, so the GET URL carries no checksum setting either.
const s3 = new S3Client({ requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED" }); // Region comes from AWS_REGION

let url, file, seconds;
if (mode === "put") {
  seconds = 300;
  // ContentType is signed into the URL: the upload must send the same Content-Type header.
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: "text/plain" });
  url = await getSignedUrl(s3, cmd, { expiresIn: seconds });
  file = "put_url.txt";
} else {
  seconds = Number(extra ?? 60);
  url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: seconds });
  file = "get_url.txt";
}
writeFileSync(file, url);

// Show what's inside the URL: the signature and its inputs travel as query parameters.
const q = new URL(url).searchParams;
console.log(`Presigned ${mode.toUpperCase()} URL written to ${file} (valid ${seconds} seconds)`);
for (const name of ["X-Amz-Algorithm", "X-Amz-Credential", "X-Amz-Date", "X-Amz-Expires", "X-Amz-SignedHeaders"]) {
  console.log(`  ${name.padEnd(20)} ${q.get(name)}`);
}
console.log(`  ${"X-Amz-Security-Token".padEnd(20)} ${q.has("X-Amz-Security-Token") ? "present (signed with temporary credentials)" : "absent (long-term key)"}`);
console.log(`  ${"x-amz-checksum-*".padEnd(20)} ${[...q.keys()].some((k) => k.startsWith("x-amz-checksum")) ? "present" : "none"}`);
console.log(`  ${"X-Amz-Signature".padEnd(20)} ${q.get("X-Amz-Signature")?.slice(0, 16)}...`);

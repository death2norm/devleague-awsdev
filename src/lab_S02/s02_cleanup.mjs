// DevLeague AWS Developer · Session 2 lab, clean-up: delete every version and delete marker, then the bucket.
// Run: node s02_cleanup.mjs YOUR-BUCKET
// Why a script? In a versioned bucket, "aws s3 rb --force" removes only the current versions. The older
// versions and the delete markers stay, so the bucket isn't empty and can't be deleted.
// The DynamoDB table AWSDevFiles is NOT deleted: Session 3 uses it (on-demand, about $0 when idle).
import { S3Client, ListObjectVersionsCommand, DeleteObjectsCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";

const bucket = process.argv[2];
if (!bucket) { console.error("Usage: node s02_cleanup.mjs YOUR-BUCKET"); process.exit(1); }
const s3 = new S3Client({});

let versions = 0, markers = 0;
// ListObjectVersions has no paginator helper, so this loop follows the two markers itself (up to 1,000 per page).
let KeyMarker, VersionIdMarker, page;
do {
  page = await s3.send(new ListObjectVersionsCommand({ Bucket: bucket, KeyMarker, VersionIdMarker }));
  const objects = [
    ...(page.Versions ?? []).map((v) => ({ Key: v.Key, VersionId: v.VersionId })),
    ...(page.DeleteMarkers ?? []).map((m) => ({ Key: m.Key, VersionId: m.VersionId })),
  ];
  versions += page.Versions?.length ?? 0; markers += page.DeleteMarkers?.length ?? 0;
  for (let i = 0; i < objects.length; i += 1000) {          // DeleteObjects takes up to 1,000 keys per call
    const res = await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects.slice(i, i + 1000), Quiet: true } }));
    if (res.Errors?.length) { console.error("Some deletes failed:", res.Errors); process.exit(1); }
  }
  ({ NextKeyMarker: KeyMarker, NextVersionIdMarker: VersionIdMarker } = page);
} while (page.IsTruncated);
await s3.send(new DeleteBucketCommand({ Bucket: bucket }));
console.log(`Deleted ${versions} object versions and ${markers} delete markers, then the bucket ${bucket}.`);
console.log("The table AWSDevFiles stays for Session 3.");

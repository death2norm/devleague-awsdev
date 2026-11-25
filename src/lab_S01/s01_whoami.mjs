// DevLeague AWS Developer · Session 1 lab, Part 1: the same question as `aws sts get-caller-identity`, from code.
// Run: node s01_whoami.mjs
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const sts = new STSClient({});                 // no keys in code: the default credential chain finds them
const id = await sts.send(new GetCallerIdentityCommand({}));
console.log({ Account: id.Account, Arn: id.Arn, UserId: id.UserId });
const creds = await sts.config.credentials();  // what the chain found (never print the secret)
console.log("Access key starts with:", creds.accessKeyId.slice(0, 4),
  "| temporary (has a session token):", Boolean(creds.sessionToken),
  "| expires:", creds.expiration ?? "no expiry (long-term key)");

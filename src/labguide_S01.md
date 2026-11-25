# AWS Developer Session 1 Lab: Credentials, the CLI and the SDK

*40 minutes in your breakout room · your own AWS account · AWS CloudShell · lab files: AWSDev_S01_LabFiles.zip on this page*

## Before You Start

- Sign in to the AWS console as your **admin user, not the root user**. You set this up in Week 0.
- In the Region menu at the top right, pick **US East (N. Virginia) us-east-1**. Use it for every lab in this course.
- Everything tonight is free on the free plan: CloudShell, STS and a few small S3 objects. You delete the bucket at the end.
- Work out loud with your group. Each person does the steps in their own account, and the group fills in one worksheet together.

## Part 1: Who Am I? (8 minutes)

1. Open CloudShell: the terminal icon in the console's top bar, or search for CloudShell. Wait for the prompt.
2. Ask AWS who your credentials belong to:

> aws sts get-caller-identity

3. Write the Account and the Arn on your worksheet. The Arn should end with your admin user's name.
4. Ask the CLI where it found those credentials. Look at the **Type** column:

> aws configure list

5. Upload the lab files: choose **Actions**, then **Upload file**, and pick AWSDev_S01_LabFiles.zip. Then unpack them and install the SDK packages (about 20 seconds):

> unzip -o AWSDev_S01_LabFiles.zip && cd lab_S01 && npm install

6. Ask the same question from code:

> node s01_whoami.mjs

7. On your worksheet, write how the access key starts (ASIA or AKIA) and whether the credentials are temporary.

**If the upload doesn't work:** open each .mjs file and package.json from this Moodle page and copy it. In CloudShell, make the folder with mkdir lab_S01 and cd lab_S01, then for each file type nano and the file name, paste, and press Ctrl+O, Enter, Ctrl+X. Then run npm install.

## Part 2: Objects, Pages and the Credential Chain (14 minutes)

1. Make a bucket name that nobody else in the world has, and save it in a variable:

> BUCKET=awsdev-s01-$(aws sts get-caller-identity --query Account --output text)-$RANDOM
> echo $BUCKET

2. Make the bucket with the CLI, then check it's there:

> aws s3 mb s3://$BUCKET
> aws s3 ls

3. Run the SDK script. It puts five small JSON objects, reads one back and lists them two at a time with a paginator. Its logger is turned on, so lines that start with [chain] show each place the SDK looked for credentials:

> node s01_objects.mjs $BUCKET

4. On your worksheet, write the **last [chain] line** (where the SDK found credentials) and **how many pages** the paginator returned.
5. Check the objects with the CLI:

> aws s3 ls s3://$BUCKET/orders/

6. Optional: see everything the logger reports (a long list):

> FULL_LOG=1 node s01_objects.mjs $BUCKET

**If CloudShell timed out:** idle sessions end. Your files are still there, but the BUCKET variable is gone. Run aws s3 ls to find your bucket name, then set it again with BUCKET= and the name.

## Part 3: Watch the SDK Retry (8 minutes)

1. This script points an S3 client at an address where nothing is listening, with maxAttempts set to 3. Run it:

> node s01_retry.mjs

2. Write the **Attempts** and **Total retry delay** on your worksheet.
3. Run it again. Did the delay change? Write both numbers.
4. Allow five attempts and compare:

> node s01_retry.mjs 5

## Part 4: Clean Up (3 minutes)

1. Delete the bucket and everything in it:

> aws s3 rb s3://$BUCKET --force

2. Confirm it's gone (it shouldn't be listed):

> aws s3 ls

## Part 5: Worksheet (remaining time)

Fill in the Session 1 Lab Worksheet with your group: where the SDK finds credentials in four setups, which first move each error calls for, and the check-first ticket. Upload one worksheet per person to this assignment.

## If Something Goes Wrong

- **BucketAlreadyExists:** the name is taken. Run the BUCKET line again to get a new random number.
- **Cannot find module:** you're not in the lab_S01 folder or npm install didn't finish. Run cd ~/lab_S01 and npm install.
- **AccessDenied on everything:** you may be signed in as a user without admin rights. Run aws sts get-caller-identity and check the Arn.
- Stuck for more than 3 minutes? Ask in your group, then press Ask for Help in Zoom.

# AWS Developer Session 1 Lab Worksheet

*Name: ______________________    Group: ______    Upload to the Session 1 Lab assignment in Moodle.*

## Part A: Your Lab Readings

| Reading | What you saw |
|---|---|
| Account and Arn from aws sts get-caller-identity | |
| Type column in aws configure list | |
| Access key starts with (ASIA or AKIA)? Temporary? | |
| Last [chain] line from s01_objects.mjs | |
| Pages returned by the paginator | |
| Retry run 1: attempts and total retry delay | |
| Retry run 2: attempts and total retry delay | |
| Retry with 5 attempts: attempts and total retry delay | |

## Part B: Where Does the SDK Find Credentials?

The same Node.js code, with no credentials in it, runs in four places. For each one, name the step of the credential provider chain that supplies the credentials, and say whether they are long-term or temporary.

| Where the code runs | Chain step that finds the credentials | Long-term or temporary? |
|---|---|---|
| 1. AWS CloudShell | | |
| 2. A developer's laptop with a named profile in the shared credentials file (access key, no Identity Center) | | |
| 3. An AWS Lambda function | | |
| 4. An Amazon EC2 instance with an instance profile | | |

## Part C: First Move for Each Error

| Error message says | First thing you check or do |
|---|---|
| The security token included in the request is expired | |
| RequestTimeTooSkewed | |
| ThrottlingException | |
| The bucket must be addressed using the specified endpoint | |

## Part D: Check-First Ticket

A developer's Node.js script uses the SDK to put objects into an S3 bucket. It works perfectly when she runs it in CloudShell. She deploys the same code, unchanged, as a Lambda function, and every call fails with AccessDenied. She says, "But I have full S3 access."

What would you check first, and why? (Three sentences or fewer.)

______________________________________________________________________________

______________________________________________________________________________

______________________________________________________________________________

## Part E: One Sentence

Which wrong answer tonight felt most right to you, and why?

______________________________________________________________________________

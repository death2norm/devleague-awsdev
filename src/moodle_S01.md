# AWS Developer Session 1: Moodle Checklist

*For the admin building the course on learn.devleague.com (Moodle 4.5). Section: Session 01 · Credentials, the CLI and the SDK. Copy each activity's settings from the matching Security+ Session 1 activity, then change only what's listed here.*

## Before the Session (platform check, not a TryHackMe check)

- [ ] This course has no TryHackMe room. Instead, the platform check in docs/awsdev_final_checks.md (items S01-1 to S01-5) must be done once in a new free-plan account before the first cohort: CloudShell upload, npm install, Node version, the Type column of aws configure list, and the [chain] output.
- [ ] Upload the lab files zip and test that it downloads.

## Section Contents

| Activity | Type | File or source | Settings |
|---|---|---|---|
| Session 1 Slides | File | AWSDev_S01_SlideDeck.pptx exported to PDF | View completion |
| Session 1 Handout | File | AWSDev_S01_StudentHandout.pdf | View completion |
| Session 1 Lab | Assignment | Description: the lab guide text (kit tools/moodle/lab_html.py). Attachments: AWSDev_S01_LabWorksheet.docx and AWSDev_S01_LabFiles.zip | File submission, 1 file; Lab Completion scale; gradebook category Labs |
| Session 1 Reflection | Quiz | 3 essays from the prompts below (kit tools/moodle/moodle_reflections.py, RUBRIC_TOPIC="AWS development") | 15 marks, 1 attempt; category Reflections |
| Session 1 Exam-Style Quiz | Quiz | AWSDev_S01_Quiz.gift.txt (12 questions, 2 of them choose two) | Unlimited attempts, deferred feedback, full review after each attempt; category Session Quizzes |

## GIFT Import

1. Question bank, Import, GIFT format. Upload AWSDev_S01_Quiz.gift.txt.
2. It creates the category DevLeague AWS Developer / Session 01 with 12 questions.
3. Check Q04 and Q09 import as **multiple answer** items (checkboxes, "choose two"), each right choice worth 50% and each wrong choice -100%. In a preview, picking one right and one wrong choice must score 0.
4. Add all 12 questions to the quiz in the order imported. Maximum grade 12.

## Reflection prompts

> 1. In your own words, explain the order of the credential provider chain for the SDK for JavaScript version three, and describe a situation where a leftover setting early in the chain would make your code use the wrong credentials.
> 2. A teammate wants to put an IAM user's access key in a Lambda function's environment variables "so it just works." Explain what you would recommend instead and why, using the difference between long-term and temporary credentials.
> 3. Describe one operation in an application you've worked on (or can imagine) that would not be safe to retry. How would you make it idempotent, and what fallback would you show users if a dependency it calls were down?

## After the Session

- [ ] Add the class recording link to the section.
- [ ] Check that lab submissions are arriving and the TA is grading on the Lab Completion scale.

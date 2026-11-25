# AWS Developer Session 2: Moodle Checklist

*For the admin building the course on learn.devleague.com (Moodle 4.5). Section: Session 02 · Storing Data: S3 and DynamoDB. Copy each activity's settings from the matching Session 1 activity, then change only what's listed here.*

## Before the Session (platform check, not a TryHackMe check)

- [ ] The platform check in docs/awsdev_final_checks.md (items S02-1 to S02-6) must be done once in a new free-plan account before the first cohort: table and index creation, the lifecycle rule, presigned URL errors, the capacity readings and the clean-up script.
- [ ] Upload the lab files zip and test that it downloads.

## Section Contents

| Activity | Type | File or source | Settings |
|---|---|---|---|
| Session 2 Slides | File | AWSDev_S02_SlideDeck.pptx exported to PDF | View completion |
| Session 2 Handout | File | AWSDev_S02_StudentHandout.pdf | View completion |
| Session 2 Lab | Assignment | Description: the lab guide text (kit tools/moodle/lab_html.py). Attachments: AWSDev_S02_LabWorksheet.docx and AWSDev_S02_LabFiles.zip | File submission, 1 file; Lab Completion scale; gradebook category Labs |
| Session 2 Reflection | Quiz | 3 essays from the prompts below (kit tools/moodle/moodle_reflections.py, RUBRIC_TOPIC="AWS development") | 15 marks, 1 attempt; category Reflections |
| Session 2 Exam-Style Quiz | Quiz | AWSDev_S02_Quiz.gift.txt (12 questions, 2 of them choose two) | Unlimited attempts, deferred feedback, full review after each attempt; category Session Quizzes |

## GIFT Import

1. Question bank, Import, GIFT format. Upload AWSDev_S02_Quiz.gift.txt.
2. It creates the category DevLeague AWS Developer / Session 02 with 12 questions.
3. Check Q06 and Q12 import as **multiple answer** items (checkboxes, "choose two"), each right choice worth 50% and each wrong choice -100%. In a preview, picking one right and one wrong choice must score 0.
4. Add all 12 questions to the quiz in the order imported. Maximum grade 12.

## Reflection prompts

> 1. Explain why a presigned URL can stop working before its expiry time. Describe how you would design a download link for customers that keeps working for as long as the business needs.
> 2. Pick an application you know (or can imagine) and list three of its read patterns. Choose a partition key and sort key for its main table, and say which pattern, if any, needs a secondary index and which kind.
> 3. A teammate says, "We'll just Scan with a filter for now and fix it later." Explain what that costs as the table grows, and what you would ask about the access pattern before agreeing.

## After the Session

- [ ] Add the class recording link to the section.
- [ ] Check that lab submissions are arriving and the TA is grading on the Lab Completion scale.
- [ ] Remind students in the course forum to keep the AWSDevFiles table for Session 3.

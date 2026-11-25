# AWS Developer Session 2 Lab Worksheet

*Name: ______________________    Group: ______    Upload to the Session 2 Lab assignment in Moodle.*

## Part A: Your Lab Readings

| Reading | What you saw |
|---|---|
| Table status, index status and billing mode (Part 1) | |
| Versions and delete markers under reports/ before you deleted the marker | |
| X-Amz-Expires and X-Amz-Security-Token on the PUT URL | |
| HTTP status of the correct upload; error code with the wrong Content-Type | |
| Error code from the GET link after it expired | |
| R2 and R4: Count, ScannedCount and capacity for the Query and the Scan | |
| R5 and R6: the GSI query right after the write; the ConsistentRead attempt | |
| R7: capacity of the eventually and strongly consistent GetItem | |
| R8 and R10: the exception names | |

## Part B: Pick the Keys

For each access pattern, choose the partition key and the sort key (or "none"), and say whether you'd need an index. Patterns 1 and 2 are separate tables. Pattern 3 is one table that needs two lookups.

| Access pattern | Partition key | Sort key | Index needed? |
|---|---|---|---|
| 1. A ticketing app shows all tickets one customer has bought, newest first | | | |
| 2. A fitness app shows one watch's heart-rate readings between two times | | | |
| 3. A shop looks up an order by its order number, and also lists one store's orders by day | | | |

In one sentence: why would the date alone be a bad partition key for pattern 2?

______________________________________________________________________________

## Part C: Capacity Math

Show your steps: round the item size, multiply, then halve or double.

| Read load | Strongly consistent RCUs | Eventually consistent RCUs |
|---|---|---|
| 1. 50 reads per second of 6 KB items | | |
| 2. 120 reads per second of 3 KB items | | |

## Part D: Check-First Ticket

A developer's code writes an upload record to the AWSDevFiles table with PutItem and then, a moment later, queries fileKey-index for that file's key to show it on screen. Every so often the new record is missing from the results. She adds ConsistentRead: true to the index query to fix it.

What happens when she runs it, and what would you do instead? (Three sentences or fewer.)

______________________________________________________________________________

______________________________________________________________________________

______________________________________________________________________________

## Part E: One Sentence

Which wrong answer tonight felt most right to you, and why?

______________________________________________________________________________

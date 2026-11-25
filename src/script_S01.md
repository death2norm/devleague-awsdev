# Opening — How This Course Works

*Objectives: DVA-C03 exam strategy (all domains)*

[SLIDE 1.01]

*Instructor intro: if you are not Alfred Rezk, replace the next paragraph with your own name and background. Everything after it works for any instructor.*

Good evening, everybody, and welcome to the first session of DevLeague AWS Developer. My name is Alfred Rezk. I've spent my career writing software and teaching people to write software, and these days most of the code I care about runs on AWS. For the next four weeks I'm going to be the voice in your headphones three nights a week, and my job is simple. I want you to walk into the testing center knowing how AWS actually behaves when your code talks to it, and I want you to recognize the wrong answers before they recognize you.

[SLIDE 1.02]

You're working adults, so you deserve to know exactly how every night runs. Every session is three hours, and it's always the same shape. I teach for about fifty minutes. We take a ten-minute break. I teach for about another fifty minutes. We take a second ten-minute break, and when you come back from that one, you go straight into your breakout room for the lab. You'll have the same small group every night. Labs happen in your own AWS account, in a browser tab, so there's nothing to install. When lab time is up, we all come back to the main room, we walk through what you found, and I take questions until we're done. After class there's a short quiz and three reflection questions in Moodle. That's your homework, and it's how you find out what stuck.

[SLIDE 1.03]

Now let's talk about the exam, because I want you to know exactly what you're training for. You're preparing for the AWS Certified Developer Associate exam, the current version, which is DVA-C03. You get sixty-five questions in one hundred thirty minutes. Fifteen of those questions are unscored. AWS is testing them out for future exams, and they don't tell you which ones, so you treat every question as if it counts. The score runs from one hundred to one thousand, and you need a seven hundred twenty to pass. The scoring is compensatory, which is a fancy way of saying you don't have to pass each section separately. A strong showing in one domain can carry a weaker one. The exam costs one hundred fifty dollars, and if you don't pass, you wait fourteen days before you can try again.

There are two question formats. Multiple choice gives you four answers and one is right. Multiple response gives you five or more answers and tells you how many to pick, usually two. There's no partial credit on those. Pick one right and one wrong, and the whole question is wrong. So from tonight on, every session has at least two "choose two" questions, and you'll practice them until they feel normal.

One more thing about the exam. It's language-neutral. AWS doesn't care whether you write Java, Python, Go, or JavaScript. In this course, every code example and every lab uses JavaScript on Node.js with the AWS SDK for JavaScript version three, because one language all the way through is easier to follow. What you learn about how the SDK finds credentials, retries, and pages through results works the same way in every language AWS supports.

Here's how the voucher works. In the last week you'll take a timed practice exam built just like the real one, sixty-five questions in one hundred thirty minutes. When you score fifty-five out of sixty-five or higher, you get your exam voucher and you schedule your test. If you're not there on the first try, you'll get more chances, with Practice Exams C and D. We don't hand out vouchers on day one, because we want you walking in ready, not hopeful.

[SLIDE 1.04]

Tonight is about the ground floor of everything else in this course. Before your code can store a file, run a function, or call an API, it has to do three things. It has to find credentials. It has to sign the request so AWS believes it. And it has to handle the moment when the call fails, because sooner or later every call fails. So tonight we'll cover how AWS questions are written, how AWS is laid out in Regions and accounts, the three ways in, the credential provider chain, temporary credentials, signed requests, the SDK itself, errors and retries, idempotency, serialization, and AI coding assistants. Then we'll put it together on a real ticket.

Every topic goes through the same steps. First I'll give you an everyday version of the idea. Then I'll put you in a real office with real people at their desks. Then I'll tell you exactly what broke and the exact setting, command, or error message that shows it or fixes it. Then I'll show you the wrong answer the exam plants and why your gut wants it. At the end of most topics I'll read a practice question, and I want your answers in the chat before I explain it. Don't take notes word for word. The handout in Moodle covers the core of tonight. What I want from you is attention on the reasoning. Alright. Let's go to a food delivery company.

# Block 1 — The Question Has a Budget

*Objectives: DVA-C03 exam strategy; 2.1.3 (programmatic access)*

[SLIDE 1.05]

Here's the everyday version. You ask a friend to pick up dinner, and you say, "Get me something with no peanuts, under fifteen dollars, and it has to be ready in ten minutes." Your friend comes back with a gorgeous forty-dollar steak dinner that took an hour. It's a great meal. It's also the wrong answer, because you gave three limits and they ignored all of them. AWS questions work exactly like that. Almost every answer choice on this exam is something that would work. The question is which one works inside the limits the question set.

Let's go to work. Picture a food delivery company in Denver with about forty engineers. A developer named Maya owns a small Node.js service that runs on an EC2 instance, which is a virtual server you rent from AWS by the hour. Her service needs to upload delivery receipts into an S3 bucket. S3 is AWS's object storage service, where files live as objects inside containers called buckets. Maya's tech lead, Devon, tells her in standup, "Make it work, keep it secure, and I don't want anyone rotating keys by hand every ninety days." That last sentence is a limit, and it's going to decide the answer.

[SLIDE 1.06]

Maya has options. She could create an IAM user, generate an access key, and paste the key into a config file on the server. That works today. But somebody has to rotate that key, and if the server image ever gets copied, the key goes with it. She could store the key in an environment variable on the server. Same problem, the key is still a long-lived secret somebody has to manage. Or she could create an IAM role, attach it to the EC2 instance through what's called an instance profile, and let the SDK pick up temporary credentials automatically. The credentials rotate on their own, they never sit in a file, and nobody touches them. That's the answer Devon described, even though he never said the word role.

So how do you read an AWS question? It usually has three parts. There's the scenario, which tells you who's doing what. There's the constraint, which is a short phrase like "with the least operational overhead," "most cost-effective," "without changing application code," or "most secure." And there's the ask, which tells you how many answers to pick. "Least operational overhead" means the fewest things a human has to build, patch, rotate, or babysit. It usually points toward a managed service or a built-in feature instead of something you build yourself. "Most cost-effective" means the cheapest thing that still meets the requirement, which is not the same as the cheapest thing on the list. And "choose two" means you need both halves of a fix, and the two right answers usually do different jobs.

Now here's the trap, and I want you to really sit with it. The question is going to describe Maya's situation and end with "least operational overhead." One of the choices is going to say something like, "Store the access key in an encrypted file and write a script that rotates the key every thirty days." That answer feels responsible. It mentions encryption. It mentions rotation. It sounds like the work of a careful engineer. But read the constraint again. A rotation script is something a human has to write, schedule, monitor, and fix when it breaks. That's operational overhead, and the question asked for the least of it. If you pick the rotation script, you've let the security vocabulary override the plain limit the question set.

[SLIDE 1.07]

Let's try one. A developer runs an application on an Amazon EC2 instance. The application must read objects from an S3 bucket. The company wants the most secure solution with the least operational overhead. Which solution meets these requirements?

A. Create an IAM user, store its access key in a file on the instance, and rotate it every thirty days.
B. Store the IAM user's access key in environment variables on the instance.
C. Attach an IAM role with S3 read permissions to the instance through an instance profile.
D. Embed the access key in the application code and restrict the bucket policy to the instance's IP address.

Let's take them apart. A works, but the thirty-day rotation is manual work, which breaks "least operational overhead," and the key still lives on disk. B moves the same long-term key into an environment variable, so nothing really changed. D is the worst of the four, because keys in code end up in source control, and an IP restriction doesn't make a leaked key safe. C gives the instance temporary credentials that AWS rotates for you, and the SDK finds them without a single line of key handling in the code. The answer is C. Keep that pattern, because the role answer is going to come back all night.

# Block 2 — The Bucket Is in Oregon

*Objectives: DVA-C03 1.1.5 (AWS service APIs and SDKs); 2.1.5 (authenticated calls)*

[SLIDE 1.08]

Here's the everyday version. Your mailing address has layers. There's the country, the state, the city, the street, and the house number. If you get the state wrong, it doesn't matter how perfect the house number is. The letter goes to the wrong place. AWS is laid out in layers too, and your code has to get the layers right before anything else works.

The biggest layer is the Region. A Region is a geographic area like Northern Virginia, which AWS calls us-east-1, or Oregon, which is us-west-2. Each Region is separate from the others, and most resources you create live in exactly one Region. Inside each Region are Availability Zones, usually three or more. An Availability Zone is one or more data centers with their own power and networking, far enough apart that a flood or a power failure in one shouldn't take out another. You spread your application across zones so a bad day in one building doesn't become a bad day for your customers. Then there's the account. An AWS account is a container for resources and a billing boundary, identified by a twelve-digit number. And every resource has an Amazon Resource Name, an ARN, which is its full mailing address. It reads like this: arn, then the partition, usually aws, then the service, then the Region, then the account number, then the resource. Some services leave pieces empty. An S3 bucket ARN has no Region and no account in it, because bucket names are unique across all of AWS. An IAM role ARN has no Region, because IAM is global.

[SLIDE 1.09]

Now let's go back to the delivery company. A developer named Luis is building a reporting job on his laptop. He set his default Region to us-east-1 months ago and forgot about it. His teammate created the reports bucket in us-west-2, Oregon. Luis runs his script, and instead of a list of files he gets an error. The message says the bucket must be addressed using a different endpoint, and in another version of the same mistake it says the Region us-east-1 is wrong and it was expecting us-west-2. Luis reads the first word, error, and messages his teammate, "I think I don't have permission to the bucket."

Here's what actually broke. Every AWS service has endpoints, which are the web addresses your code sends requests to, and most of them include the Region, like s3.us-west-2.amazonaws.com. The SDK builds the endpoint from the Region you configured. Luis's SDK sent the request to the Virginia endpoint for a bucket that lives in Oregon, and S3 told him so. It's not a permissions problem at all. The fix is to set the client's Region to us-west-2, either in code with the region setting on the client, or with the AWS_REGION environment variable, or in his profile. And here's the detail that saves you time: the error message named the Region it expected. Read the whole message before you start changing policies.

[SLIDE 1.10]

Here's the trap. A question describes a script that works for one bucket and fails for another with an error about the endpoint or the Region, and the choices include "attach the AmazonS3FullAccess policy to the user." That answer is tempting because "the call failed" and "add permissions" are glued together in a lot of people's heads. But a permissions failure says AccessDenied, with a 403 status. A Region mismatch says the endpoint or the Region is wrong, and it names the right one. Adding permissions to a request that's going to the wrong building won't get it delivered. When the error message mentions a Region or an endpoint, fix the Region.

And one more trap in this block. People hear Availability Zone and Region and blur them together. If a question asks how to survive the failure of a single data center, the answer spreads across Availability Zones in one Region. If it asks how to survive the loss of an entire geographic area, or to keep data in a specific country, that's a Region question. Different layer, different answer.

[SLIDE 1.11]

Let's try one. A developer needs to write an IAM policy that grants access to a single S3 bucket named delivery-receipts. Which ARN correctly identifies the bucket?

A. arn:aws:s3:::delivery-receipts
B. arn:aws:s3:us-east-1:123456789012:delivery-receipts
C. arn:aws:s3:us-east-1::bucket/delivery-receipts
D. arn:aws:iam::123456789012:bucket/delivery-receipts

B looks complete, and that's why it's tempting. It has a Region and an account, like most ARNs. But S3 bucket names are unique across all of AWS, so bucket ARNs leave the Region and account empty. C invents a bucket prefix that S3 doesn't use. D puts the bucket under IAM, which is the wrong service entirely. A is the answer: arn, aws, s3, two empty fields, then the bucket name. If you also need the objects inside the bucket, you add a second ARN with a slash and a star after the name, which is a detail you'll use in Session 6.

# Block 3 — Three Ways In

*Objectives: DVA-C03 1.1.5 (AWS service APIs and SDKs); 2.1.3 (programmatic access)*

[SLIDE 1.12]

Here's the everyday version. Your bank gives you three ways in. You can walk up to a teller, you can use the ATM, or you can use the app on your phone. All three reach the same account and the same money. The teller is friendly and slow. The ATM is fast for the same few things every time. The app is what other software would use if it needed to talk to your bank. AWS is the same. There's one set of service APIs underneath, and there are three ways to reach them.

The first way is the console, the website you sign in to. It's great for exploring, for seeing what exists, and for one-time setup. The second way is the AWS Command Line Interface, the CLI. You type commands like aws s3 ls, and the CLI calls the same APIs the console does. It's great for repeatable tasks and scripts. The third way is a software development kit, an SDK, which is a library you use inside your own code. When your application needs to put a file in S3 or read a record from a database, it uses the SDK. All three end up as the same signed HTTPS requests to the same service endpoints. The console is not a special back door. It's just another client.

[SLIDE 1.13]

Back at the delivery company, a developer named Priya has a weekly chore. Every Monday she signs in to the console, clicks into S3, creates a bucket for the new week's partner uploads, clicks through the settings, and copies the name into a chat message. It takes her twenty minutes, and twice she's mistyped the name. Her manager asks her to make it repeatable. So Priya opens CloudShell. CloudShell is a command-line shell that runs in your browser, right inside the console. It already has the AWS CLI, Node.js, and Python installed, and it's already signed in as you, using the same identity you used to sign in to the console. There's no access key to create and nothing to install. Each Region gives you a small persistent home directory, about a gigabyte, so files you save there are still there next time.

Priya types aws s3 mb, which stands for make bucket, followed by the bucket name, and it's done in a second. Then she adds a query option to pull out exactly the field she needs. The CLI has an option called query that filters the output, and an option called output that picks the format, like JSON, text, or a table. With those two options, her twenty-minute chore becomes three lines she can paste into a script. A month later, the partner team wants their app to create the bucket itself when a new partner signs up. Now it's not a chore anymore, it's a feature, and it belongs in code. That's when Priya reaches for the SDK.

[SLIDE 1.14]

Here's the trap. The question will describe a developer who needs to run AWS CLI commands right away from a locked-down company laptop where installing software isn't allowed, and it'll say the company doesn't allow long-term access keys. One of the choices will be "install the AWS CLI and run aws configure with a new access key." That's the classic way to start with the CLI, and every tutorial on the internet begins with it. But it breaks both limits. It installs software, and aws configure stores a long-term access key on the laptop. CloudShell runs in the browser and uses the credentials from your console sign-in, so it fits both restrictions without any setup at all.

There's a second trap in the other direction. If a question asks how an application running in production should call AWS, CloudShell is wrong. CloudShell is a tool for a person at a keyboard. It's not a place to host an application. Applications use the SDK, with credentials from a role. Ask yourself who's making the call. A person exploring uses the console or CloudShell. A person automating uses the CLI. Software uses the SDK.

[SLIDE 1.15]

Let's try one. A developer must run several AWS CLI commands against the company's account today. The developer's laptop does not allow software installation, and company policy prohibits creating access keys for users. Which solution meets these requirements with the least effort?

A. Install the AWS CLI in a container on the laptop and configure it with an access key.
B. Write a Node.js script with the SDK and run it on the laptop with a new access key.
C. Use the console's S3 page to perform the same tasks by hand.
D. Open AWS CloudShell from the console and run the commands there.

A breaks both restrictions. A container is still installed software, and it still needs an access key. B creates an access key, which policy forbids, and it's more work than the CLI commands themselves. C avoids keys, but the question said CLI commands, and doing several of them by hand in the console is slow and easy to get wrong. D runs the CLI in the browser with the credentials from the developer's console sign-in, with nothing installed and no keys created. The answer is D.

# Block 4 — Which Key Did It Use?

*Objectives: DVA-C03 2.1.3 (programmatic access); 2.1.5 (authenticated calls); 1.1.5 (SDKs)*

[SLIDE 1.16]

Here's the everyday version. You're running late, and you're looking for your car keys. You always check in the same order. First your jacket pocket, then the bowl by the door, then the kitchen counter, then the hook in the garage. The moment you find a set of keys, you stop looking and you leave. Now imagine your spouse's car keys are in your jacket pocket from last weekend. You grab them, you're out the door, and you're halfway to work in the wrong car before you notice. You didn't do anything wrong. You followed your order perfectly. The problem is what was sitting in the first place you looked.

The SDK looks for credentials the same way, in a fixed order called the credential provider chain. For the SDK for JavaScript version three running in Node.js, the order goes like this. First, environment variables, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, plus AWS_SESSION_TOKEN when the keys are temporary. Second, IAM Identity Center, which AWS used to call single sign-on, when your profile is set up for it. Third, the shared config and credentials files in the .aws folder in your home directory, which is where named profiles live. Fourth, credential_process, a profile setting that runs an outside program to hand back credentials. Fifth, a web identity token file, which is how some container platforms and CI systems trade their own token for AWS credentials. Sixth, the container credentials endpoint, a local web address that containers on ECS use, and CloudShell uses too. And last, the EC2 instance metadata service, which is how an EC2 instance hands its role's credentials to code running on it. The first provider that finds credentials wins, and the SDK stops looking.

[SLIDE 1.17]

Let's go back to Luis at the delivery company. Six months ago he worked on a staging project, and to save time he put two lines at the bottom of the startup file for his terminal that export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for the staging account. He forgot about them. This month he's on the production reporting job, and he carefully set up a default profile in his credentials file for the production account. He runs the script that's supposed to write the monthly report to the production bucket. The script succeeds. Nobody in production sees a report. Two days later somebody on the staging team asks why there's a monthly report folder in their bucket.

Here's what happened, step by step. The SDK started down the chain. The first stop is environment variables, and Luis's terminal had the staging keys sitting right there. The SDK found them, stopped looking, and never reached the credentials file with his production profile. Every call after that was signed as the staging user. The bucket names were similar enough that the staging user had a matching bucket, so nothing even failed. The fix is to remove the stale lines from his startup file, or to name the profile explicitly with the AWS_PROFILE environment variable or the profile option on the client. And here's the habit that would have caught it in five seconds: run aws sts get-caller-identity. It returns the account number and the ARN of whoever your credentials belong to. If the account number isn't the one you expected, stop before you run anything else.

In the lab tonight, you'll turn on the SDK's logger, and you'll actually watch the chain. You'll see it check the environment, check for Identity Center, check the files, check credential_process, check for a token file, and then land on the container endpoint, because that's where CloudShell keeps your credentials.

[SLIDE 1.18]

Here's the trap. The question describes a developer with credentials in two places and asks which ones the SDK uses. One choice says the default profile in the credentials file. That's tempting, because the word default sounds like it should win. But default only means it's the profile used when you don't name one. It doesn't move the file ahead of the environment. Environment variables come first. The other version of this trap is on servers. A question says an application on an EC2 instance has an instance role, but it's using the wrong permissions, and somebody left an access key in the environment of the process. The role is near the end of the chain. The leftover key is at the front. The key wins, which is why the fix is to remove the key, not to add permissions to the role.

[SLIDE 1.19]

Let's try one. A developer's terminal has the environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY set for account A. The developer's shared credentials file has a default profile for account B. The developer has not set any other credential settings and runs a Node.js script that uses the SDK for JavaScript version three with no credentials in code. Which credentials does the script use?

A. The default profile for account B, because the default profile is checked first
B. The environment variables for account A
C. Neither, because the SDK fails when it finds credentials in two places
D. Temporary credentials from the instance metadata service

A is the trap we just talked about. Default doesn't mean first. C sounds cautious, but the SDK doesn't fail when there are two sets. It takes the first one in its order and never looks further. D is the last stop in the chain, and the SDK never gets there because it already found keys, and a laptop has no instance metadata anyway. B is the answer. Environment variables are at the front of the chain. If you want account B, remove the variables or name the profile.

# Block 5 — The Key in the Public Repository

*Objectives: DVA-C03 2.1.3 (programmatic access); 2.1.5 (authenticated calls); 2.1.7 preview (assume a role)*

[SLIDE 1.20]

Here's the everyday version. Think about the difference between a house key and a hotel key card. Your house key works until you change the locks. If you lose it, whoever finds it can walk in next month, or next year. A hotel key card works for your room, for the nights you paid for, and then it stops working on its own. If you drop it in the parking lot on checkout day, nobody cares. AWS has both kinds of credentials, and the difference between them decides how bad a mistake gets.

Long-term credentials are an access key ID and a secret access key that belong to an IAM user. They work until somebody deactivates or deletes them. An access key ID that starts with the letters AKIA is long-term. Temporary credentials come from the AWS Security Token Service, called STS. They come with three parts, an access key ID that usually starts with ASIA, a secret, and a session token, and they expire on their own, anywhere from fifteen minutes to several hours later. STS hands them out through calls like AssumeRole, which lets you take on a role for a while, and GetSessionToken, which gives a user a short-term session, often after an MFA check. Every role you'll use in this course, on EC2, on Lambda, in CloudShell, works through temporary credentials. The rule for this whole course is short. Never put keys in code, and give code a role instead of a user.

[SLIDE 1.21]

Let's go to work. The delivery company hires a summer intern named Sam. Sam is building a small tool that uploads restaurant photos, and to get it working fast, he creates an IAM user, generates an access key, and puts it in a file called .env in the project folder. On a Friday afternoon he pushes the project to his public GitHub account to show his friends. He doesn't notice the .env file went with it. Automated bots scan public repositories constantly, and within minutes one of them has the key. By the time Sam gets home, someone is using that key to launch expensive servers in Regions the company doesn't even use. AWS also scans public repositories, and the account owner gets an email saying an exposed key was found. AWS attaches a quarantine policy to the user to block the riskiest actions, but that doesn't clean anything up.

Here's what the team does on Monday morning, and the order matters. First, Devon deactivates the access key in IAM, then deletes it, because a key that's been public is compromised no matter what else you do. Making the repository private doesn't help. The bots already copied it. Second, he checks CloudTrail, the service that records API calls in the account, for every call that key made, and he terminates the servers it launched. Third, the team fixes the design. Sam's tool will run with a role, and Sam himself will sign in through IAM Identity Center and get temporary credentials that expire at the end of the day. If a temporary credential ever leaks, it stops working on its own within hours.

[SLIDE 1.22]

Here's the trap. A question describes a leaked key and asks what to do, and one of the choices says "delete the commit from the repository history" or "make the repository private." Those feel like cleanup, and you should do them eventually. But they don't stop a key that's already been copied. The key itself has to be deactivated, and the long-term fix is to stop using long-term keys for that job. The other trap is the phrase "rotate the key." Rotation means creating a new key and retiring the old one, and it's a fine habit. But if the question asks for the most secure long-term fix, a new long-term key is still a long-term key. Roles and temporary credentials remove the thing that can leak.

[SLIDE 1.23]

Let's try one, and this one is a choose two. A developer discovers that an IAM user's access key was committed to a public code repository two hours ago. The key is used by an application running on an EC2 instance. Which two actions should the developer take? Choose two.

A. Make the repository private so the key is no longer visible.
B. Deactivate and then delete the exposed access key.
C. Rotate the key and commit the new key to the repository's configuration file.
D. Add a policy that denies access from IP addresses outside the company network.
E. Replace the key with an IAM role attached to the EC2 instance.

A is the trap. The key was public for two hours, so it's already been copied, and hiding it now protects nothing. C creates a brand-new long-term key and commits it right back into the repository, which sets up the same mistake for next time. D sounds clever, but a broad IP deny can break legitimate traffic, and it leaves a compromised key alive. B kills the exposed key, which is the urgent half. E removes the need for a long-term key at all, which is the lasting half. The answers are B and E. Notice how the two right answers do two different jobs, one now and one forever. That's very common in choose-two questions.

# Block 6 — The Clock That Was Twenty Minutes Slow

*Objectives: DVA-C03 2.1.5 (authenticated calls); 1.1.3 (resilient code); 2.1.4 preview (presigned URLs)*

[SLIDE 1.24]

Here's the everyday version. Think about a check. You write the amount, you sign it, and you write the date. The bank looks at all three. If the signature doesn't match, they won't cash it. If somebody changed the amount after you signed, they won't cash it. And if the date is from three years ago, they won't cash it either, because a stale check is suspicious. AWS treats every request the same way.

Every call your code makes to AWS is signed with Signature Version 4, usually shortened to SigV4. The SDK takes the request, the date and time, the Region, and the service name, and it runs them through a hashing process using your secret access key. The result is the signature, and it travels in the request. Your secret key never travels. AWS has its own copy of the secret, repeats the same math on its side, and checks that it gets the same signature. If someone changes even one header after you sign, the math doesn't match and AWS rejects it with SignatureDoesNotMatch. That's what an authenticated call is: proof of who sent the request, and proof that nobody changed it on the way. The timestamp matters too. AWS rejects a request whose time is too far from its own clock, about five minutes for most services, so a request somebody captured can't be replayed later.

[SLIDE 1.25]

Let's go to the delivery company's warehouse. There's a server in the back office that runs a nightly job. It uploads the day's delivery logs to S3, and it also creates presigned download links that get emailed to drivers. A presigned URL is a signed request turned into a link. Whoever holds the link can make that one request until it expires. In this case, each link expires fifteen minutes after it's created. A network engineer named Rosa tightens the firewall one weekend, and without meaning to, she blocks the server's time synchronization. Over the next few weeks the server's clock drifts until it's twenty minutes slow.

Here's what the team sees. In the upload job's logs there's a new error line each night. S3 says RequestTimeTooSkewed, meaning the time in the request is too far from S3's clock. But the uploads still finish. That's the SDK for JavaScript doing its job. When AWS rejects a request for clock skew, the error response includes AWS's own time. The SDK works out how far off the local clock is, adjusts the time it signs with, and retries. So you see the error once, and then the call succeeds. The drivers aren't so lucky. Every link they click returns a page that says the request has expired. The server signed each link with a time twenty minutes in the past, and the link was only good for fifteen minutes from that time. The link was dead before it was even emailed, and there's no SDK on a driver's phone to retry it.

The fix isn't in the code at all. Rosa reopens time synchronization, the clock comes back in line, and both problems disappear. On EC2 you'd point the server at the Amazon Time Sync Service, which every instance can reach at a local address.

[SLIDE 1.26]

Here's the trap. The question describes a signature error and asks for the fix, and the choices include "rotate the access key" and "attach a policy with the missing permissions." Rotating feels right because the word signature makes people think the key is bad. But a bad or deleted key gives you a different error, one that says the security token or the access key isn't valid. A clock problem says the time is skewed or the request expired, and a new key signed with the same wrong clock fails the same way. And a permissions problem says AccessDenied, which is a different error altogether. Read the error message. Clock words mean fix the clock.

[SLIDE 1.27]

Let's try one. An application on an on-premises server uses the AWS SDK to generate presigned S3 URLs that expire after ten minutes. Users report that every link returns an error saying the request has expired, even when they click it right away. Uploads from the same server succeed. What should the developer do?

A. Rotate the IAM user's access key and update the application.
B. Increase the SDK's maxAttempts setting so failed requests retry more times.
C. Configure the server to synchronize its clock with a reliable time source.
D. Grant the IAM user the s3:GetObject permission on the bucket.

A doesn't help, because a fresh key signed with the same wrong clock produces the same dead links. B is tempting because retries fixed the uploads. But the person clicking a link isn't running the SDK, so there's nothing to retry, and the link's time is baked into the URL. D would matter if the error said AccessDenied, and it doesn't. It says expired, right away, every time, from one server. C is the answer. Fix the clock, and the links last as long as they were meant to.

# Break 1

*Ten-minute break. Lecture Part 2 begins after it.*

[SLIDE 1.28]

That's the end of the first hour, and it's a good place to stop, because we've covered how your code gets in the door. Take ten minutes. Get up, refill your water, look at something that isn't a screen. If something's been bugging you, put it in the chat now and I'll pick it up when we come back. See you in ten.

# Part 2 Opening — Where We Left Off

*Objectives: DVA-C03 2.1.3, 2.1.5 (review)*

[SLIDE 1.29]

Welcome back. Let's make sure the first hour is still where we left it. We started with how AWS questions are written: a scenario, a constraint like least operational overhead, and an ask that tells you how many answers to pick. Then we got the layers right, Region, Availability Zone, account and ARN, and we saw that a Region mismatch is not a permissions problem. We covered the three ways in, the console, the CLI and the SDK, with CloudShell as the browser shell that's already signed in as you.

Then we walked the credential provider chain. Environment variables first, then Identity Center, then the shared files, then credential_process, then a web identity token, then the container endpoint, then instance metadata, and the first one that finds credentials wins. We saw why long-term keys are house keys and temporary credentials are hotel key cards, and why the lasting fix for a leaked key is a role. And we saw that every call is signed with SigV4, so a clock that's twenty minutes slow can kill a presigned link even when the SDK quietly fixes its own uploads.

Here's the second hour. We're going to look at the SDK itself, then what happens when calls fail, how to retry without doing damage, how to move data in and out of a request, and how to use an AI coding assistant without trusting it blindly. Then we'll run the whole method on a ticket. Let's go back to the finance team.

# Block 7 — Exactly One Thousand Receipts

*Objectives: DVA-C03 1.1.5 (AWS service APIs and SDKs)*

[SLIDE 1.30]

Here's the everyday version. You order a big box of books online, and they arrive in several shipments. The first box has a packing slip that says, "Shipment one of four. More to follow." If you open the first box, count the books, and announce that the order is complete, you're wrong, and the packing slip told you so. AWS APIs that return lists work the same way. They hand you results one page at a time, and every page tells you whether there's more.

Before we get to the story, here's how the SDK for JavaScript version three is put together. It's modular. Each service has its own package, like client-s3 for S3 or client-dynamodb for DynamoDB, and you install only the ones you use. That keeps your application small, which matters later when we talk about how fast Lambda functions start. Inside each package there's a client and a set of commands. You create the client once, with settings like the Region and the number of retry attempts. Then for every API call you create a command object with its input, like a PutObjectCommand with a bucket, a key and a body, and you pass it to the client's send method. Send returns a promise, so you write await in front of it and your code waits for the answer without blocking anything else. On top of that, the SDK gives you two helpers that save you from writing loops by hand. Paginators walk through every page of a list for you. Waiters check on a resource over and over until it reaches the state you want, like waiting until a new table is ready before you write to it.

[SLIDE 1.31]

Now the story. A developer on the finance team, Kendra, writes a script that counts the delivery receipts in the receipts bucket for the monthly audit. She calls ListObjectsV2 once, counts the objects that come back, and writes the total to a report. In March the report says one thousand. In April it says one thousand. In May it says one thousand. The auditor, a sharp woman named Gloria, notices the company apparently made exactly one thousand deliveries three months in a row, and she asks a very polite question.

Here's what happened. ListObjectsV2 returns at most one thousand keys per call. When there are more, the response sets IsTruncated to true and includes a NextContinuationToken. To get the next page, you call again and pass that token back. Kendra's script took the first page and stopped. The fix is the paginator. In version three it's a function called paginateListObjectsV2. You give it the client and the same input, and you loop over it with for await. It makes the first call, reads the token, makes the next call, and keeps going until the last page. Kendra's real number for May turns out to be just over forty-one thousand. In the lab tonight you'll set the page size to two on purpose, so you can watch a paginator walk through three pages of five objects.

[SLIDE 1.32]

Here's the trap. The question describes a list call that returns only part of the results and offers the choice "set MaxKeys to fifty thousand." That's tempting, because it sounds like turning a knob up until the problem goes away. But MaxKeys can only make pages smaller. S3 never returns more than a thousand keys in one response, no matter what you ask for. And even for APIs with bigger limits, a list that grows will outgrow any fixed number. The right answer handles pages, either with a paginator or by passing the continuation token back yourself. If a question says results are cut off, look for the answer that follows the token.

A related trap shows up with waiters. A question describes code that creates a resource and immediately uses it, and it fails because the resource isn't ready yet. One choice says to add a fixed sleep of thirty seconds. Sometimes thirty seconds is too long and sometimes it's not long enough. A waiter checks the actual state, and it stops as soon as the resource is ready.

[SLIDE 1.33]

Let's try one. A developer's Node.js application uses the SDK for JavaScript version three to list objects under a prefix in an S3 bucket. The prefix holds about twelve thousand objects, but the application only ever processes one thousand of them. What is the most efficient way to fix this?

A. Use the SDK's paginateListObjectsV2 paginator to process every page of results.
B. Set MaxKeys to 12,000 in the ListObjectsV2 request.
C. Switch from ListObjectsV2 to the older ListObjects API.
D. Copy the objects into twelve prefixes so each one holds one thousand objects.

B is the trap, because S3 caps each response at one thousand keys, so asking for twelve thousand still gets you one page. C changes to the older version of the same API, which also returns pages of one thousand. D would technically work, but it rearranges your data to make up for a few missing lines of code, and it breaks the day the count grows again. A is the answer. The paginator follows the continuation token from page to page until there are no more pages.

# Block 8 — The Retry Storm

*Objectives: DVA-C03 1.1.3 (fault-tolerant, resilient code: retries with backoff and jitter); 1.1.5 (SDKs)*

[SLIDE 1.34]

Here's the everyday version. It's the Super Bowl, and you're calling the pizza place down the street. The line is busy. If you hang up and redial instantly, again and again, you're not helping. You and three hundred other hungry people are all redialing at once, and the line stays busy for all of you. The smart move is to wait a little, then a little longer, and to pick a slightly random moment so you're not redialing in lockstep with everybody else. That's exactly how good code retries a busy service.

First, the two families of errors. A 4xx status code means the request itself has a problem. A 403 AccessDenied means you're not allowed. A 400 ValidationException means you sent something invalid. A 404 means the thing isn't there. Sending the same request again won't change any of those, so you don't retry them. The big exception is throttling. When you go over a service's rate limit, AWS answers with a throttling error, like ThrottlingException, or ProvisionedThroughputExceededException from DynamoDB, or a 429 Too Many Requests. Those are worth retrying, after a pause. A 5xx status code means something went wrong on AWS's side, like a 500 InternalError or a 503 ServiceUnavailable, and those are worth retrying too, along with network timeouts and dropped connections.

[SLIDE 1.35]

Now the story. A developer named Terrence writes the nightly menu import. It loads fifty thousand menu items into a DynamoDB table with twenty workers running at once. The table has a fixed amount of write capacity, and the import blows right past it. DynamoDB starts answering with ProvisionedThroughputExceededException. Terrence had wrapped every write in his own retry loop with no pause at all, so the moment a write fails, the worker sends it again. Twenty workers hammer the table in perfect lockstep, the throttling gets worse, and the import that should take ten minutes takes two hours. His loop also retries a ValidationException forever, on one menu item that has an empty key, so one worker never finishes.

Here's the fix, and most of it is deleting code. The SDK already retries for you. Its default retry mode is called standard. It retries throttling errors, 5xx errors and network errors, up to a total number of attempts set by maxAttempts, which defaults to three, and that count includes the first try. Between attempts it waits using exponential backoff, which means each wait is roughly twice as long as the one before, plus jitter, which means a random part of that wait, so twenty workers spread out instead of hitting the table together. There's also a mode called adaptive, which adds a client-side rate limiter that slows the client down when it sees throttling. For a big batch job against a busy table, Terrence raises maxAttempts on the client, chooses adaptive mode, and removes his own loop. And the item with the empty key goes to an error log on the first failure, because no number of retries will ever make it valid.

In the lab tonight, you'll point a client at an address where nothing is listening, set maxAttempts to three, and read two fields off the error, the number of attempts and the total retry delay. Run it twice and the delays will be different. That's the jitter.

[SLIDE 1.36]

Here's the trap. A question describes throttling and offers "retry the request immediately in a loop until it succeeds." That sounds persistent and reliable. It's the opposite. Immediate retries make throttling worse, and an unlimited loop never gives up on errors that will never succeed. The other trap is the reverse: "increase maxAttempts" offered as the fix for an AccessDenied error. More attempts at a request you're not allowed to make just give you more AccessDenied errors. Retries are for problems that time can fix.

[SLIDE 1.37]

Let's try one, and it's a choose two. An application uses the AWS SDK with custom error handling. The developer wants the application to retry only errors that might succeed on a later attempt. Which two errors should the application retry? Choose two.

A. A 503 ServiceUnavailable error from the service
B. A 403 AccessDenied error from S3
C. A 400 ValidationException caused by a missing required field
D. A ThrottlingException because the request rate was exceeded
E. A 404 NoSuchKey error from S3

B, C and E are all problems with the request itself. You're not allowed, you sent something invalid, or the object doesn't exist, and none of those change if you wait. B is the trap for a lot of people, because access errors feel like they might be temporary, but a policy doesn't fix itself in a few hundred milliseconds. A is a server-side error, and D is throttling, and both are exactly what backoff with jitter is for. The answers are A and D.

# Block 9 — Charged Twice for One Burrito

*Objectives: DVA-C03 1.1.3 (fault-tolerant, resilient code: idempotency, graceful degradation)*

[SLIDE 1.38]

Here's the everyday version. You walk up to an elevator and press the button. Nothing seems to happen, so you press it again, and again. The elevator doesn't come three times. Pressing the button once or five times gives you the same result, one elevator. That's what idempotent means. An operation is idempotent when doing it more than once has the same effect as doing it once. Reading a file is idempotent. Setting a value to seven is idempotent. Adding seven to a balance is not, and charging a credit card is definitely not.

That matters because of everything we just said about retries. A retry happens when your code doesn't know whether the first attempt worked. Sometimes the first attempt failed. But sometimes the request reached the other side, the work got done, and the response got lost on the way back. If the operation is idempotent, a retry is harmless. If it isn't, a retry does the work twice.

[SLIDE 1.39]

Let's go to the checkout team. A customer named Mr. Okafor orders a burrito on a slow hotel wifi connection. The checkout service calls the payment provider to charge his card. The payment provider charges the card and sends back a success, but the response takes longer than the checkout service's timeout, so the checkout service treats the call as failed and retries. The payment provider sees a brand-new charge request and charges the card again. Mr. Okafor gets one burrito and two charges, and he calls support, and he's not wrong to be angry.

The fix is an idempotency key. When the checkout service starts a payment, it creates one unique ID for that order, and it sends that same ID on every attempt. The payment side keeps a record of the IDs it has already processed. When the second attempt arrives with an ID it has seen, it doesn't charge again. It returns the result of the first charge. Several AWS APIs build this in. EC2's RunInstances takes a client token, so a retried launch doesn't start two servers, and DynamoDB's transactional writes take a client request token for the same reason. For your own data, you'll learn in Session 2 how a conditional write in DynamoDB can say "only write this item if it doesn't exist yet," which turns a second attempt into a harmless no.

The other half of this block is graceful degradation. The menu page also shows restaurant ratings from a separate ratings service. One evening that service goes down. In the old version of the code, the menu page waited thirty seconds and then showed an error, so nobody could order anything because one small feature was broken. In the new version, the call to the ratings service has a short timeout and a fallback. If ratings don't come back in time, the page shows the menu without stars. Customers keep ordering. That's graceful degradation. When a dependency fails, the important part of the service keeps working with less.

[SLIDE 1.40]

Here's the trap. A question describes duplicate charges or duplicate records after retries, and one of the choices says "disable retries in the SDK." It feels like you've found the cause, so you remove it. But now every real network hiccup becomes a failed order, and the next question will ask why the checkout fails one time in fifty. The right answer keeps the retries and makes the operation safe to repeat, with an idempotency key or a conditional write. Retries and idempotency are partners. You want both.

[SLIDE 1.41]

Let's try one. A Lambda function processes orders and writes a payment record for each order. Because of retries, the same order is sometimes processed twice, creating two payment records. What is the best way to prevent duplicate payment records while keeping retries?

A. Turn off retries in the SDK client and log any failed requests.
B. Use the order ID as an idempotency key and skip any order that has already been recorded.
C. Increase the function's timeout so requests never time out.
D. Add a random delay before each write so duplicates are less likely.

A removes the retries the question told you to keep. C makes timeouts rarer, but a retry can still happen after a network error, and the question asked you to prevent duplicates, not to make them rarer. D just spreads the duplicates out in time. B is the answer. The order ID is the same on every attempt, so recording it once and checking it every time makes the write idempotent.

# Block 10 — The Photo That Was Really Text

*Objectives: DVA-C03 1.1.7 (serialize and deserialize data)*

[SLIDE 1.42]

Here's the everyday version. When you move to a new house, you can't drive your couch, your dishes and your bookshelf across town loose in the back of the truck. You pack them into boxes, you label the boxes, and at the other end somebody unpacks them and puts everything back together. If you unpack a box of dishes and treat it as a box of books, you're going to have a bad afternoon. Moving data over a network works the same way. Serialization is packing your data into a format that can travel, like JSON text or raw bytes. Deserialization is unpacking it on the other side. And the two sides have to agree on what's in the box.

The formats you'll see most in AWS are JSON, which is text that describes objects and lists, binary data, which is raw bytes like an image or a zip file, and base64. Base64 is a way of writing binary bytes using only ordinary letters, numbers and a couple of symbols, so binary data can ride safely inside something that only allows text, like a JSON document or an email. It makes the data about a third bigger. And it's an encoding, not encryption. Anyone can decode it, instantly, with no key.

[SLIDE 1.43]

Back to Priya and the partner integration. A partner restaurant sends menu photos to the delivery company's API inside a JSON message, and since JSON is text, the photo arrives as a base64 string in a field called image. Priya's first version takes that string and puts it straight into S3 with a key ending in .jpg. The upload succeeds, but every photo shows up broken in the app. When she downloads one and opens it in a text editor, she sees letters and numbers, not an image. She stored the packed box, not the dishes. The fix is one line. Decode the base64 string into bytes with Buffer.from, giving it the string and the word base64, and upload the bytes with a content type of image/jpeg.

She hits two more serialization bumps that same week. When she tries to save the order details, she passes the JavaScript object straight in as the body of the PutObject call, and the call fails with an error about a stream that doesn't mention JSON at all. The body has to be a string, bytes, or a stream, so she serializes the object first with JSON.stringify. And when she reads an object back, the body isn't a string. In version three of the SDK, the body of a GetObject response is a stream, so the data can arrive in pieces without loading a huge file into memory. She has to read it with transformToString, or transformToByteArray for binary, and then JSON.parse the text to get an object back. You'll do exactly that in the lab tonight.

[SLIDE 1.44]

Here's the trap. A question says a company stores customer data as base64 in a database "so the data is protected," and asks what's wrong, or it offers "base64-encode the data before storing it" as a way to secure sensitive data. Base64 looks scrambled, and that's the whole trap. To a person glancing at it, it looks like encryption. But there's no key. Any developer, or any attacker, can decode it in one line. If a question asks how to protect data, the answer involves encryption with keys, which you'll cover in Session 7. If a question asks how to fit binary data into a text format, the answer is base64.

[SLIDE 1.45]

Let's try one. A developer receives images from a partner as base64-encoded strings inside JSON messages and stores each string as an S3 object with the .png extension. Users report that the images will not open. What should the developer do?

A. Encrypt the objects with server-side encryption before storing them.
B. Set the object's content type to application/json.
C. Serialize the base64 string with JSON.stringify before uploading it.
D. Decode the base64 string into binary data before uploading it to S3.

A protects the data, but the images are broken, not exposed, and encryption doesn't change what's inside. B labels the object as JSON, which makes it even less likely to open as an image. C wraps the text in quotes and makes it more text. D is the answer. The bytes of the image are inside the base64 string, and decoding gets them out.

# Block 11 — The Assistant Wrote It, You Ship It

*Objectives: DVA-C03 1.1.9 (AI-assisted development tools: code generation, review, security scanning)*

[SLIDE 1.46]

Here's the everyday version. You hire a contractor to redo your kitchen. A good contractor doesn't start tearing out cabinets the minute you say "make it nicer." First they write down what you want, they draw a plan, and they list the jobs in order. You look it over and say, "No, the sink stays where it is." Then they build. And when they're done, you still walk through the kitchen and open every drawer before you pay, because your name is on the house. AI coding assistants work best the same way.

The exam expects you to know how developers use AI tools to generate code, review it, refactor it and scan it for security problems, and AWS's tool for that is Kiro. Kiro is an AI development environment built around an idea called spec-driven development. Instead of going straight from a prompt to code, it turns your request into a written spec first. That's three files: requirements, with user stories and acceptance criteria, a design that describes the parts and how data flows, and a numbered list of tasks. You review and edit those before any code gets written. Kiro also has steering files, which hold standing rules about your project, like "always use the SDK for JavaScript version three" or "never write wildcard permissions," and agent hooks, which run automatically when something happens, like running a check every time a file is saved.

[SLIDE 1.47]

At the delivery company, a developer named Aaron uses Kiro to add a photo upload feature. He describes the feature, and Kiro writes the spec. In the requirements, Aaron notices it never said what happens when a photo is too big, so he adds an acceptance criterion: when a photo is over five megabytes, the system shall reject it with a clear message. That one edit, made before any code existed, saved a bug. Kiro then writes the code. Aaron reviews the diff, and he finds two problems. The generated IAM policy allows every S3 action on every resource, a star on a star. And there's a retry loop with no wait between attempts, which you now know is how you build a retry storm. A hook the team set up to scan for secrets also flags a test file where the assistant pasted an example access key. Aaron narrows the policy to the one bucket and the two actions the feature needs, deletes the loop because the SDK already retries, and removes the key.

Nothing about this was the tool failing. The tool did what tools do. It produced a reasonable first draft fast. Aaron did what developers do. He checked it.

[SLIDE 1.48]

Here's the trap. A question describes AI-generated code and asks what the developer should do before deploying it, and one choice says something like "deploy it, because code generated by an AWS tool follows AWS best practices," or "skip the review because the unit tests pass." That's tempting because the tool is impressive and the tests are green. But tests check what somebody thought to test. They don't notice a wildcard policy or a key in a test file. The developer is responsible for every line they ship, whoever typed it. The right answers involve reviewing the spec and the code, running security scans, and applying least privilege.

[SLIDE 1.49]

Let's try one. A developer uses an AI coding assistant to generate a new feature. The generated code passes all unit tests. Which action should the developer take before deploying the code?

A. Deploy the code, because passing unit tests confirm it is secure.
B. Ask the assistant to confirm that the code follows best practices, then deploy.
C. Review the generated code and run a security scan for issues such as hardcoded secrets and overly broad permissions.
D. Regenerate the code several times and deploy the version that appears most often.

A trusts the tests to catch things tests don't check. B asks the same tool to grade its own work, which isn't a review. D treats the most common answer as the correct one. C is the answer. Read it, scan it, and fix what you find, because you're the one who owns it in production.

# Block 12 — Ticket: It Worked Yesterday

*Objectives: DVA-C03 2.1.3, 2.1.5 (programmatic access, authenticated calls); 1.1.5 (SDKs); troubleshooting method*

[SLIDE 1.50]

Let's put the night together on a real ticket, the way you'll work every ticket in this course. Here's the method in four steps. First, read the exact error message, all of it, before you touch anything. Second, ask who you are. Run aws sts get-caller-identity, and think about which step of the credential chain answered. Third, ask what changed since it last worked. Fourth, make the smallest fix that matches the error.

Here's the ticket. Kendra from finance runs her receipts report from her laptop. It worked yesterday afternoon. This morning it fails before it lists a single object. Her teammate's first suggestion in the chat is, "Just make yourself an access key so it stops breaking."

Step one, the error. It doesn't say AccessDenied. It says the security token included in the request is expired, and when she runs a CLI command with the same profile, the CLI says her sign-in session has expired. Step two, who is she? Her profile is set up for IAM Identity Center. When she signed in yesterday, Identity Center gave her temporary credentials, and the session behind them lasts for a set number of hours. The SDK found that profile in the shared config file, second in the chain, and used those credentials. Step three, what changed? Nothing in the code. Only the time. The hotel key card did exactly what it was designed to do. It stopped working.

[SLIDE 1.51]

Step four, the smallest fix. Kendra runs aws sso login with her profile name, signs in through the browser, and gets a fresh session. The report runs. No code changes, no new keys, no new permissions.

Now look at her teammate's suggestion, because I'd expect it as a wrong answer. A long-term access key would stop the expirations. It would also bring back every risk we covered in Block 5. A key on a laptop is a key that can leak, and it never expires on its own. The expiration is the security feature, not the bug. And the other tempting wrong answer is adding permissions. The error didn't say AccessDenied, so permissions aren't the problem. Same lesson as the Region error and the clock error. Read the words in the message, and match the fix to the words.

So here's tonight's whole list of error words and where they send you. If the message says AccessDenied, check who you are with get-caller-identity first, and only then look at the policy, because half the time the policy is fine and the identity is wrong. If it says the token is expired, the credentials were temporary and the session ended, so refresh the session. If it says the time is skewed or the request expired the moment it was made, check the clock. If it names a different Region or endpoint, fix the Region in the client. If it says throttling, let the SDK back off and retry. And if it says validation, fix the request, because retrying it won't help. Six kinds of messages, six different first moves, and not one of them starts with creating an access key.

[SLIDE 1.52]

Let's try one. A developer's script uses a named profile configured for IAM Identity Center. The script worked the previous day but now fails with an error saying the token has expired. What should the developer do?

A. Run aws sso login for the profile to start a new session, then rerun the script.
B. Create a long-term access key for the developer and add it to the credentials file.
C. Attach the AdministratorAccess policy to the developer's permission set.
D. Change the script to sign requests with Signature Version 2.

B ends the expirations by bringing back a long-term secret, which is the risk temporary credentials exist to remove. C answers a permissions error that nobody got. D is not a real fix, because AWS services expect Signature Version 4, and the signature was never the problem. A is the answer. The session expired, so start a new one.

# Closing — Lab Handoff

*Objectives: Lab readiness · Break 2 follows this section, then the lab begins*

[SLIDE 1.53]

Here's what happens next. We're taking our second ten-minute break, and when it's over you'll land in your breakout room with your group. Everything you need is on the Session 1 Lab page in Moodle. Open it first, and download the lab files.

You'll work in CloudShell in your own AWS account, signed in as your admin user, not the root user. Part one, you'll run aws sts get-caller-identity and a short script that asks the same question from code. Part two, you'll make a bucket with the CLI, then run a script that puts five objects, reads one back, and lists them with a paginator, with the logger turned on so you can watch the credential chain. Part three, you'll force retries against an address where nothing is listening and read the attempts and the delay off the error. Part four, you'll delete your bucket. Don't skip the clean-up. Then fill in the worksheet: where the SDK finds credentials in four different setups, and one check-first ticket.

Work it out loud with your group, and if your group disagrees, write down both answers and bring the argument back. You've got forty minutes after the break. Before next session, do the twelve-question quiz and the three reflection questions in Moodle. I'll see you in the breakout rooms.

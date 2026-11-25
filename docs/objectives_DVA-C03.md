# AWS Certified Developer – Associate (DVA-C03) objectives (for reviewers)

*Source: AWS DVA-C03 exam guide, docs.aws.amazon.com/aws-certification/latest/developer-associate-03/ (checked Nov 25, 2026). DVA-C03 is the only version from Dec 1, 2026; DVA-C02's last day was Nov 30, 2026. Skill wording below is condensed; reviewers check the live guide for exact text.*

| Domain | Weight | Practice exam (of 65) |
|---|---|---|
| 1 Development with AWS Services | 30% | 20 |
| 2 Security | 26% | 17 |
| 3 Testing and Deployment | 22% | 14 |
| 4 Troubleshooting and Optimization | 22% | 14 |

Exam: 65 questions (50 scored, 15 unscored and unmarked), 130 minutes, multiple choice (1 of 4) and multiple response (2+ of 5+, all must be right), scaled 100–1,000, pass 720, compensatory. $150. 14-day wait between attempts. Valid 3 years. Unscored "emerging topics" items may cover AI-assisted development. Target candidate: 1+ year hands-on AWS development, one high-level language. Out of scope: designing architectures or CI/CD pipelines, administering IAM users/groups or servers, picking foundation models or designing RAG, designing ETL or networks.

## Domain 1: Development with AWS Services (30%)
**1.1 Develop code for applications hosted on AWS**
- 1.1.1 Tightly vs loosely coupled systems
- 1.1.2 Synchronous vs asynchronous patterns
- 1.1.3 Fault-tolerant, resilient code (retries with backoff and jitter, graceful degradation)
- 1.1.4 Create, extend and maintain APIs (transformations, request validation)
- 1.1.5 Use AWS service APIs and SDKs
- 1.1.6 Manage streaming data (Kinesis, Data Firehose)
- 1.1.7 Serialize and deserialize data
- 1.1.8 Event-driven patterns (EventBridge, S3 notifications, SQS, SNS)
- 1.1.9 AI-assisted development tools (code generation, review, refactoring, security scanning)
- 1.1.10 Integrate managed AWS AI services (Bedrock)

**1.2 Develop code for AWS Lambda**
- 1.2.1 Lambda access to private VPC resources
- 1.2.2 Configuration: environment variables, memory, concurrency, timeout, runtime, handler, layers, extensions
- 1.2.3 Event lifecycle and errors (destinations, dead-letter queues)
- 1.2.4 Integrate with services in code, event source mappings, destinations

**1.3 Use data stores in application development**
- 1.3.1 Data lifecycle (S3 Lifecycle, TTL, retention)
- 1.3.2 Choose data stores by access pattern (ElastiCache, DynamoDB, S3, RDS)
- 1.3.3 Choose a caching approach
- 1.3.4 DynamoDB: high-cardinality partition keys, read consistency, Query vs Scan, keys, attributes, indexes

## Domain 2: Security (26%)
**2.1 Authentication and authorization for applications and AWS services**
- 2.1.1 Identity federation (Cognito, SAML/OIDC)
- 2.1.2 Access control (fine-grained permissions, security tokens, MFA)
- 2.1.3 Programmatic access to AWS
- 2.1.4 Presigned URLs (S3, CloudFront)
- 2.1.5 Authenticated calls to AWS services
- 2.1.6 Permissions for IAM principals and resources
- 2.1.7 Assume an IAM role

**2.2 Encryption and sensitive data**
- 2.2.1 Encryption at rest and in transit
- 2.2.2 Certificates (ACM, AWS Private CA)
- 2.2.3 Client-side vs server-side encryption
- 2.2.4 Encrypt and decrypt with keys (KMS)
- 2.2.5 Generate certificates and SSH keys for development
- 2.2.6 Identify, mask and limit access to sensitive data (PII, PHI)
- 2.2.7 Secrets management (Secrets Manager, Parameter Store)

**2.3 Security risks of using and integrating AI services (new in C03)**
- 2.3.1 Request and manage access to AI services
- 2.3.2 Data privacy controls (VPC endpoints, inputs and outputs not used for training)
- 2.3.3 Filter and control model inputs and outputs (content filters, PII redaction, denied topics, prompt injection protection)
- 2.3.4 Secure AI agent interactions (tool-use authorization, session isolation, human approval)
- 2.3.5 Keep sensitive content out of monitoring logs

## Domain 3: Testing and Deployment (22%)
**3.1 Prepare application artifacts**
- 3.1.1 Dependencies (environment variables, config files, container images)
- 3.1.2 Container images (ECR, Dockerfiles, tagging, lifecycle policies)
- 3.1.3 Code repositories in deployment environments
- 3.1.4 Environment-specific configuration (AppConfig, Parameter Store, Secrets Manager, API Gateway stages, Lambda)
- 3.1.5 API Gateway features (stage URLs, endpoints)

**3.2 Implement and automate testing**
- 3.2.1 Develop and validate tests (SAM, CDK, CloudFormation)
- 3.2.2 Mock APIs for external dependencies (API Gateway)
- 3.2.3 Test events (JSON for Lambda and API Gateway)
- 3.2.4 Environments (Lambda aliases, image tags, Amplify branches, Copilot environments, API Gateway stages)
- 3.2.5 AWS AI tools for test generation and automation

**3.3 Deploy with AWS CI/CD services**
- 3.3.1 Lambda packaging (.zip, container images, layers)
- 3.3.2 Deploy containers (ECS task definitions, EKS manifests, Fargate, rolling updates)
- 3.3.3 IaC templates (CloudFormation, SAM)
- 3.3.4 CodeDeploy revisions
- 3.3.5 CodePipeline orchestration (repo triggers, multi-environment)
- 3.3.6 Deployment strategies (blue/green, canary, rolling)
- 3.3.7 Automatic or manual rollback (CloudFormation, CodeDeploy)
- 3.3.8 Source control features (labels, branches)
- 3.3.9 AWS AI tools in CI/CD (approvals, environment provisioning, post-deployment checks)

## Domain 4: Troubleshooting and Optimization (22%)
**4.1 Root cause analysis**
- 4.1.1 Debug code and service integration issues
- 4.1.2 Interpret metrics, logs and traces
- 4.1.3 Query logs (CloudWatch Logs Insights)
- 4.1.4 Deployment failures from output logs
- 4.1.5 AWS AI tools to analyze errors and suggest fixes

**4.2 Logging, monitoring and observability**
- 4.2.1 Structured logging
- 4.2.2 Custom metrics in code (embedded metric format)
- 4.2.3 Notification alerts (quota limits, deployment completions)
- 4.2.4 Tracing (X-Ray)
- 4.2.5 Workload health (health checks, liveness and readiness probes)

**4.3 Optimize applications**
- 4.3.1 Concurrency (Lambda provisioned concurrency, EC2 Auto Scaling, thread pools, connection pooling)
- 4.3.2 Memory and compute
- 4.3.3 Messaging (SQS, SNS fan-out)
- 4.3.4 Caching (ElastiCache, DAX, CloudFront)
- 4.3.5 Find bottlenecks (CloudWatch)
- 4.3.6 AWS AI tools to find optimizations

New in-scope services for C03 include Amazon Data Firehose, Amazon Bedrock, Bedrock AgentCore, Kiro, CloudWatch Logs, AWS SAM, PrivateLink, ACM, AWS Private CA and S3 Glacier. Removed from scope: AWS AppSync, Amazon Q Developer.

Session mapping: course map (`docs/awsdev_course_map_v1.md`) section 3. Reviewers check every claimed task against the script, quiz and keys.

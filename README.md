# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


To create a TypeScript-based User Service as an AWS Lambda function integrated with API Gateway, following serverless best practices, I’ll design a new implementation inspired by your Express.js user service but tailored for a serverless environment. Your Express.js service provides user authentication with endpoints for registration (/register), login (/login), token refresh (/refresh), and logout (/logout), using MongoDB, JWT, and validation. You’re working in your CDK project (/home/syed/Documents/cdk-backend/ with aws-cdk-lib@2.195.0) and want to use API Gateway (as confirmed), with TypeScript and serverless best practices.

I’ll:

Design a TypeScript Lambda function for the User Service, handling /users/register, /users/login, /users/refresh, /users/logout.
Follow serverless best practices:
Single Lambda per service for simplicity and cost efficiency.
Environment variable management via AWS SSM Parameter Store or Secrets Manager.
Connection pooling for MongoDB to optimize cold starts.
Lightweight validation without heavy dependencies.
Proper error handling and logging.
Modular code with dependency injection.
Type-safe API Gateway event handling.
Integrate with your CDK stack, alongside HelloHandler, PythonHandler, and HelloHandler2, using API Gateway with distinct paths.
Provide local testing with sam local start-api and deployment instructions.
Address stopping sam local start-api, as you’ve asked about stopping processes.
Ensure TypeScript compatibility with your existing setup (tsconfig.cdk.json, typescript@5.6.3).
Requirements (Based on Your Express.js)
Endpoints:
POST /users/register: Create a user (name, email, password, role: customer/company), return JWT access/refresh tokens.
POST /users/login: Authenticate user (email, password), return tokens.
POST /users/refresh: Refresh access token using refresh token.
POST /users/logout: Blacklist access token, delete refresh token.
Features:
MongoDB for user data, refresh tokens, and blacklisted tokens.
JWT for authentication (access token: 15m, refresh token: 7d).
Password hashing (bcrypt).
Input validation.
Cookie-based access token (via Set-Cookie header).
Assumptions:
MongoDB Atlas for database (via MONGO_URI).
TypeScript for type safety.
Single Lambda handling all routes for simplicity.
API Gateway with CORS for client access.
Serverless Best Practices
Single Responsibility: One Lambda for the User Service, handling all user-related routes.
Stateless: No reliance on in-memory state; use MongoDB for persistence.
Connection Management: Reuse MongoDB connections across invocations.
Secrets Management: Store MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET in AWS Secrets Manager.
Lightweight Dependencies: Use zod for validation instead of express-validator.
Logging: Structured logging with AWS CloudWatch.
Timeout and Memory: Set appropriate Lambda timeout (30s) and memory (256MB).
Type Safety: Use TypeScript for API Gateway events and MongoDB models.
CDK: Define infrastructure with explicit API Gateway routes.
Directory Structure
text

Copy
cdk-backend/
├── lambda/
│   ├── hello.js
│   ├── hello2.js
├── python-lambda/
│   ├── lambda_function.py
│   ├── hello2.py
├── src/
│   ├── hello.ts
│   ├── hello2.ts
├── user-service-lambda/
│   ├── src/
│   │   ├── handler.ts
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── blacklisted-token.ts
│   │   │   ├── refresh-token.ts
│   │   ├── services/
│   │   │   ├── auth-service.ts
│   │   │   ├── db-service.ts
│   │   ├── types.ts
│   │   ├── validation.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
├── lib/
│   ├── cdk-backend-stack.ts
├── tsconfig.json
├── tsconfig.cdk.json
# User Management Service

This project provides a serverless User Management Service deployed on AWS using the **AWS Cloud Development Kit (CDK)** with TypeScript and the **AWS Serverless Application Model (SAM)**. The service handles core user management functionalities such as **user registration**, **authentication**, and **profile management**.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **AWS CLI** (v2.x)
- **AWS CDK** (v2.x) - Install globally with `npm install -g aws-cdk`
- **AWS SAM CLI** (v1.x) - For local testing and debugging

Additionally, configure your AWS CLI with the necessary credentials and a default region:

```bash
aws configure
```

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/user-management-service.git
   ```
   Replace `your-repo` with the actual repository owner.

2. **Navigate to the project directory**:
   ```bash
   cd user-management-service
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

To run and test the service locally:

1. **Synthesize the CDK stack**: This generates a CloudFormation template from your TypeScript code.
   ```bash
   cdk synth
   ```

2. **Start the local API using SAM**: This launches a local instance of your API for testing.
   ```bash
   sam local start-api --template cdk.out/UserManagementStack.template.json
   ```
   Note: Replace `UserManagementStack.template.json` with the actual template file name generated in the `cdk.out/` directory if it differs.

3. **Test the API endpoints**: Use tools like `curl` or Postman to interact with the local API. For example:
   ```bash
   curl http://localhost:3000/users
   ```
   This assumes an endpoint like `/users` exists. Refer to the project’s API documentation or source code for specific endpoints.

## Deployment

To deploy the service to AWS:

1. **Verify AWS credentials**: Ensure your AWS CLI is configured with valid credentials.

2. **Deploy the CDK stack**: This provisions the necessary AWS resources.
   ```bash
   cdk deploy
   ```

3. **Confirm deployment**: Follow the CLI prompts to approve the changes. Once complete, CDK will output the deployed API endpoint URLs.

After deployment, your service will be live, and you can access the API endpoints as provided in the CDK output.

## Architecture

The User Management Service leverages a serverless architecture on AWS, comprising the following components:

- **API Gateway**: Receives and routes incoming HTTP requests to the appropriate backend services.
- **Lambda Functions**: Execute the business logic for user registration, authentication, and profile management.
- **DynamoDB**: Provides persistent storage for user data.
- **Cognito**: Manages user authentication and authorization.

Note: The exact architecture may vary depending on the implementation. Refer to the CDK stack definitions in the `lib/` directory for details.

## Cleaning Up

To remove the deployed resources and avoid incurring unnecessary AWS costs:

```bash
cdk destroy
```

Follow the prompts to confirm the deletion of the stack.

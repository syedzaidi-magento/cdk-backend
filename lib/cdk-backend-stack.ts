import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Existing Lambdas
    const helloFn = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambda', { exclude: ['*.ts', '*.d.ts'] }),
    });

    const helloFn2 = new lambda.Function(this, 'HelloHandler2', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'hello2.handler',
      code: lambda.Code.fromAsset('lambda', { exclude: ['*.ts', '*.d.ts'] }),
    });

    // UserService Lambda
    const userServiceFn = new lambda.Function(this, 'UserService', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('user-service-lambda/dist'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        MONGO_URI: process.env.MONGO_URI || '',
        JWT_SECRET: process.env.JWT_SECRET || '',
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
        NODE_ENV: 'development',
      },
    });

    // API Gateway for existing Lambdas
    const helloApi = new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: helloFn,
      restApiName: 'HelloApi',
      proxy: false,
      deployOptions: { stageName: 'prod' },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });
    helloApi.root.addResource('hello').addMethod('ANY', new apigateway.LambdaIntegration(helloFn));

    const hello2Api = new apigateway.LambdaRestApi(this, 'Hello2Endpoint', {
      handler: helloFn2,
      restApiName: 'Hello2Api',
      proxy: false,
      deployOptions: { stageName: 'prod' },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });
    hello2Api.root.addResource('hello2').addMethod('ANY', new apigateway.LambdaIntegration(helloFn2));

    // API Gateway for UserService
    const userApi = new apigateway.LambdaRestApi(this, 'UserServiceEndpoint', {
      handler: userServiceFn,
      restApiName: 'UserApi',
      proxy: false,
      deployOptions: { stageName: 'prod' },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      },
    });
    const users = userApi.root.addResource('users');
    users.addResource('register').addMethod('POST', new apigateway.LambdaIntegration(userServiceFn));
    users.addResource('login').addMethod('POST', new apigateway.LambdaIntegration(userServiceFn));
    users.addResource('refresh').addMethod('POST', new apigateway.LambdaIntegration(userServiceFn));
    users.addResource('logout').addMethod('POST', new apigateway.LambdaIntegration(userServiceFn));

    // Outputs
    new cdk.CfnOutput(this, 'HelloHandlerApiUrl', { value: helloApi.url });
    new cdk.CfnOutput(this, 'HelloHandler2ApiUrl', { value: hello2Api.url });
    new cdk.CfnOutput(this, 'UserServiceApiUrl', { value: userApi.url });
  }
}

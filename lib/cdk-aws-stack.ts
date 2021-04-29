import * as path from 'path';

import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { FunctionProps } from '@aws-cdk/aws-lambda';

export class TodoAppStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const helloLambda = new lambda.Function(this, 'HelloLambda', {
			code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
			handler: 'hello.handler',
			runtime: lambda.Runtime.NODEJS_14_X,
			memorySize: 256,
			environment: { isProduction: "maybe" }
		} as FunctionProps);

		new apiGateway.LambdaRestApi(this, 'Endpoint', {
			handler: helloLambda,
		});
	}
}

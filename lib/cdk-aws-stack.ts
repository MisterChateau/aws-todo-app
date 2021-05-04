import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import { TodoBackend } from './todoBackend/todo-backend';

export class TodoAppStack extends Stack {
	constructor(scope: App, id: string, props?: StackProps) {
		super(scope, id, props);

		// Instantiate backend Construct
		const todoBackend = new TodoBackend(this, 'TodoBackend');

		// Setup gateway API
		const api = new LambdaRestApi(this, 'TodoApi', {
			handler: todoBackend.handler,
			proxy: false,
		});

		api.root.addMethod('ANY');

		const todos = api.root.addResource('todos');
		todos.addMethod('GET');
		todos.addMethod('POST');

		const todo = todos.addResource('{id}');
		todo.addMethod('DELETE');
		todo.addMethod('PATCH');

		// Create static asset bucket
		const assetsBucket = new Bucket(this, 'assets', {
			websiteIndexDocument: 'index.html',
			publicReadAccess: true,
		});

		// Deploy assets
		new BucketDeployment(this, 'assetsDeploy', {
			destinationBucket: assetsBucket,
			sources: [
				Source.asset(path.join(__dirname, 'assets')),
			],
		});
	}
}

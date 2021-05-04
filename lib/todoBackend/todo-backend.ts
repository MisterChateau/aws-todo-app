import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Grant } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, StackProps } from '@aws-cdk/core';
import { join } from 'path';

export class TodoBackend extends Construct {
	// Create dynamoDb table
	todoTable: Table = new Table(this, 'Todo', {
		partitionKey: { name: 'id', type: AttributeType.STRING },
	});

	// Create Lambda handler
	handler = new Function(this, 'TodoHandler', {
		code: Code.fromAsset(join(__dirname, '..', 'lambda')),
		handler: 'todo.handler',
		runtime: Runtime.NODEJS_14_X,
		environment: { tableName: this.todoTable.tableName },
	});

	// Give handler access to DynamoDB table
	tableGrant: Grant = this.todoTable.grantReadWriteData(this.handler);

	constructor(scope: Construct, id: string, _props?: StackProps) {
		super(scope, id);
	}
}

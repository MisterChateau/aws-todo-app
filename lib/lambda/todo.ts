import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
const tableName = process.env.tableName as string;
const dbClient = new DynamoDB.DocumentClient();

export type Todo = {
	id: string;
	todo: string;
	done: boolean;
};

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
	const { httpMethod, pathParameters } = event;
	console.log(JSON.stringify(event));

	try {
		//* /todos */
		if (httpMethod == 'GET' && !pathParameters) {
			const todos = await getTodos();
			return createResponse(todos.Items || []);
		}

		if (httpMethod === 'POST') {
			if (!event.body) {
				throw { error: 'property "todo" missing', code: 400 };
			}
			const body = JSON.parse(event.body);

			const todo = await insertTodo(body.todo);
			return createResponse(todo);
		}

		/* /todos/{id} */
		if (httpMethod === 'PATCH' && pathParameters) {
			if (!event.body || !pathParameters.id) {
				throw {
					error: 'missing parameters / properties',
					code: 400,
				};
			}

			const body = JSON.parse(event.body);

			const todo = await updateTodo(pathParameters.id, body);
			return createResponse(todo);
		}

		if (httpMethod === 'DELETE' && pathParameters) {
			if (!pathParameters.id) {
				throw {
					error: 'missing parameters {id}',
					code: 400,
				};
			}

			const todo = await deleteTodo(pathParameters.id);
			return createResponse(todo);
		}

		return createResponse('method_unsupported', 400);
	} catch (error) {
		if (error.error && error.code) {
			return createResponse(error.error, error.code);
		} else {
			return createResponse(error, 500);
		}
	}
};

function createResponse(response: any, statusCode: number = 200) {
	const body = JSON.stringify(response);
	return {
		statusCode,
		body,
	};
}

function getTodos() {
	return dbClient
		.scan({
			TableName: tableName,
		})
		.promise();
}

function getTodo(id: string) {
	return dbClient
		.get({
			TableName: tableName,
			Key: { id },
		})
		.promise();
}

function insertTodo(todo: string) {
	const id = uuidv4();

	return dbClient
		.put({
			TableName: tableName,
			Item: {
				id,
				todo: todo,
				done: false,
			},
		})
		.promise()
		.then(() => getTodo(id))
		.then(({ Item }) => Item);
}

function updateTodo(id: string, item: Todo) {
	return dbClient
		.update({
			TableName: tableName,
			Key: { id: id },
			UpdateExpression: 'SET todo = :todo, done = :done',
			ExpressionAttributeValues: {
				':todo': item.todo,
				':done': item.done,
			},
		})
		.promise()
		.then(() => getTodo(item.id))
		.then(({ Item }) => Item);
}

function deleteTodo(id: string) {
	return dbClient
		.delete({
			TableName: tableName,
			Key: {
				id,
			},
		})
		.promise();
}

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
	console.log('event', JSON.stringify(event));
	console.log('is production ?q', process.env.isProduction);

	return {
		statusCode: 200,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(event),
	};
};

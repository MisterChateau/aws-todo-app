# Prerequisites

Install aws cli
Create a user in IAM and provide access-key ID and secret with
>$ aws configure

Install aws-cdk
>$ npm install aws-cdk


# CDK project
It demonstrates a CDK app with an instance of a stack (`CdkAwsStack`)
which contains Lamba, API gateway and DynamoDb

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

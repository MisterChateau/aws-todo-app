import { App } from '@aws-cdk/core';
import { TodoAppStack } from '../lib/cdk-aws-stack';

const app = new App();
new TodoAppStack(app, 'TodoAppStack');

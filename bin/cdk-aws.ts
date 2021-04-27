#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkAwsStack } from '../lib/cdk-aws-stack';

const app = new cdk.App();
new CdkAwsStack(app, 'CdkAwsStack');

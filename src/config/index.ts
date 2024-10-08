import dotenv from 'dotenv';
import Logger from '../utils/logger';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['AWS_REGION', 'COGNITO_USER_POOL_ID'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    Logger.error(`Environment variable ${varName} is missing.`);
    process.exit(1); // Exit the application if a required variable is missing
  }
});

export const config = {
  awsRegion: process.env.AWS_REGION as string,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID as string,
};

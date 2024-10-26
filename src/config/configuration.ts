export default () => ({
  port: parseInt(process.env.PORT!, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    ssl: process.env.DB_SSL,
    sslFile: process.env.DB_SSL_CA,
  },
  cognito: {
    region: process.env.COGNITO_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX!, 10) || 100,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION_TIME,
  },
});

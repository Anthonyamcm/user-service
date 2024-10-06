import 'reflect-metadata';
import app from './app';
import Logger from './utils/logger';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  Logger.info(`User Service running on port ${PORT}`);
});

import { DataSource } from 'typeorm';
import configuration from './config/configuration';
import { Profile } from './profile/profile.entity';
import { User } from './user/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
// Import other entities as needed

// Initialize configuration manually for CLI usage
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT!, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'postgres',
  entities: [User, Profile /*, other entities */],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
  ssl: process.env.DB_SSL
    ? {
        rejectUnauthorized: false, // Set to true in production
        ca: fs.readFileSync(path.join(__dirname, process.env.DB_SSL_CA!)),
      }
    : false,
});

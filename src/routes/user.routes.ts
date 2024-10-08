import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import Logger from '../utils/logger';
import { asyncHandler } from '../utils/asyncHandler';
import { DataSource } from 'typeorm';

// Initialize TypeORM DataSource (Ensure this is done once in your application)
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
});

// Initialize the DataSource
dataSource
  .initialize()
  .then(() => {
    Logger.info('Data Source has been initialized!');
  })
  .catch(err => {
    Logger.error('Error during Data Source initialization:', err);
  });

// Instantiate UserService with dependencies
const userService = new UserService(dataSource, Logger);
const userController = new UserController(userService, Logger);

const router = Router();

// Route: Create a new user
router.post(
  '/',
  authenticateJWT,
  validationMiddleware(CreateUserDto),
  asyncHandler(userController.createUser.bind(userController))
);

// Route: Get user by ID
router.get(
  '/:id',
  authenticateJWT,
  asyncHandler(userController.getUserById.bind(userController))
);

// Route: Update user by ID
router.put(
  '/:id',
  authenticateJWT,
  validationMiddleware(UpdateUserDto, true),
  asyncHandler(userController.updateUser.bind(userController))
);

// Route: Delete user by ID
router.delete(
  '/:id',
  authenticateJWT,
  asyncHandler(userController.deleteUser.bind(userController))
);

export default router;

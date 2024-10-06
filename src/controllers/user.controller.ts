import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
} from '../errors/customErrors';
import Logger from '../utils/logger';

/**
 * Controller responsible for handling user-related HTTP requests.
 */
export class UserController {
  constructor(
    private userService: UserService,
    private logger: typeof Logger
  ) {}

  /**
   * Handles the creation of a new user.
   */
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: CreateUserDto = req.body;
      const user = await this.userService.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      this.logger.error('Error creating user:', error);
      next(error);
    }
  }

  /**
   * Handles fetching a user by ID.
   */
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        this.logger.error('Error fetching user:', error);
        next(error);
      }
    }
  }

  /**
   * Handles updating a user by ID.
   */
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: UpdateUserDto = req.body;
      const user = await this.userService.updateUser(req.params.id, data);
      res.json(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        this.logger.error('Error updating user:', error);
        next(error);
      }
    }
  }

  /**
   * Handles deleting a user by ID.
   */
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        this.logger.error('Error deleting user:', error);
        next(error);
      }
    }
  }
}

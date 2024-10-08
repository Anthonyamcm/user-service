import { Repository, DataSource } from 'typeorm';
import { Users } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import bcrypt from 'bcrypt';
import Logger from '../utils/logger';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../errors/customErrors';

/**
 * Service responsible for managing user-related operations.
 */
export class UserService {
  private userRepository: Repository<Users>;

  /**
   * Initializes the UserService with the provided DataSource and Logger.
   * @param dataSource - The TypeORM DataSource instance.
   * @param logger - The Logger utility.
   */
  constructor(
    private dataSource: DataSource,
    private logger: typeof Logger
  ) {
    this.userRepository = this.dataSource.getRepository(Users);
  }

  /**
   * Creates a new user after ensuring the username is unique.
   * @param data - Data transfer object containing user details.
   * @returns The created User entity.
   * @throws UserAlreadyExistsError if the username is already taken.
   */
  async createUser(data: CreateUserDto): Promise<Users> {
    const existingUser = await this.userRepository.findOne({
      where: { username: data.username },
    });

    if (existingUser) {
      this.logger.warn(
        `Attempt to create a user with existing username: ${data.username}`
      );
      throw new UserAlreadyExistsError();
    }

    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    this.logger.info(`User created: ${savedUser.user_id}`);
    return savedUser;
  }

  /**
   * Retrieves a user by their unique ID.
   * @param id - The user's ID.
   * @returns The User entity.
   * @throws UserNotFoundError if no user is found with the given ID.
   */
  async getUserById(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });

    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
      throw new UserNotFoundError();
    }

    return user;
  }

  /**
   * Retrieves a user by their username.
   * @param username - The user's username.
   * @returns The User entity.
   * @throws UserNotFoundError if no user is found with the given username.
   */
  async getUserByUsername(username: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      this.logger.warn(`User not found with username: ${username}`);
      throw new UserNotFoundError();
    }

    return user;
  }

  /**
   * Updates an existing user's details.
   * @param id - The user's ID.
   * @param data - Data transfer object containing updated user details.
   * @returns The updated User entity.
   * @throws UserNotFoundError if no user is found with the given ID.
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<Users> {
    // Ensure the user exists before attempting an update
    const user = await this.getUserById(id);

    // Merge the new data into the existing user entity
    this.userRepository.merge(user, data);

    // Save the updated user entity
    const updatedUser = await this.userRepository.save(user);

    this.logger.info(`User updated: ${id}`);
    return updatedUser;
  }

  /**
   * Deletes a user by their ID.
   * @param id - The user's ID.
   * @throws UserNotFoundError if no user is found with the given ID.
   */
  async deleteUser(id: string): Promise<void> {
    const deleteResult = await this.userRepository.delete(id);

    if (deleteResult.affected === 0) {
      this.logger.warn(`Attempt to delete non-existent user with ID: ${id}`);
      throw new UserNotFoundError();
    }

    this.logger.info(`User deleted: ${id}`);
  }
}

import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.info(`Creating user with username: ${createUserDto.username}`);

    const { cognitoId, username, email } = createUserDto;

    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: [{ cognitoId }, { username }, { email }],
    });

    if (existingUser) {
      this.logger.warn(
        `User conflict for username: ${username}, email: ${email}`
      );
      throw new ConflictException(
        'User with provided cognitoId, username, or email already exists'
      );
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.info('Fetching all users');
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    this.logger.info(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    this.logger.info(`Fetching user with username: ${username}`);
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.warn(`User not found with username: ${username}`);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.info(`Updating user with ID: ${id}`);
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected === 0) {
      this.logger.warn(`User not found for update with ID: ${id}`);
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.findOne(id);

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    this.logger.info(`Deleting user with ID: ${id}`);
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`User not found for deletion with ID: ${id}`);
      throw new NotFoundException('User not found');
    }
  }
}

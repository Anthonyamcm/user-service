import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from '../user/user.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  /**
   * Creates a new profile for the specified user.
   * @param userId - The ID of the user.
   * @param createProfileDto - Data transfer object containing profile details.
   * @returns The created Profile entity.
   */
  async create(
    userId: string,
    createProfileDto: CreateProfileDto
  ): Promise<Profile> {
    this.logger.info(`Creating profile for user ID: ${userId}`);
    try {
      const user = await this.userService.findOne(userId);
      const profile = this.profileRepository.create({
        ...createProfileDto,
        user,
      });
      const savedProfile = await this.profileRepository.save(profile);
      this.logger.info(
        `Profile created successfully with ID: ${savedProfile.id} for user ID: ${userId}`
      );
      return savedProfile;
    } catch (error: any) {
      this.logger.error(
        `Failed to create profile for user ID: ${userId}. Error: ${error.message}`,
        { stack: error.stack }
      );
      throw new InternalServerErrorException(
        'An error occurred while creating the profile.'
      );
    }
  }

  /**
   * Retrieves all profiles.
   * @returns An array of Profile entities.
   */
  async findAll(): Promise<Profile[]> {
    this.logger.info('Fetching all profiles');
    try {
      const profiles = await this.profileRepository.find({
        relations: ['user'],
      });
      this.logger.info(`Fetched ${profiles.length} profiles successfully`);
      return profiles;
    } catch (error: any) {
      this.logger.error(`Failed to fetch profiles. Error: ${error.message}`, {
        stack: error.stack,
      });
      throw new InternalServerErrorException(
        'An error occurred while fetching profiles.'
      );
    }
  }

  /**
   * Retrieves a single profile by ID.
   * @param id - The ID of the profile.
   * @returns The Profile entity.
   * @throws NotFoundException if the profile does not exist.
   */
  async findOne(id: string): Promise<Profile> {
    this.logger.info(`Fetching profile with ID: ${id}`);
    try {
      const profile = await this.profileRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!profile) {
        this.logger.warn(`Profile with ID: ${id} not found`);
        throw new NotFoundException('Profile not found');
      }
      this.logger.info(`Profile with ID: ${id} fetched successfully`);
      return profile;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch profile with ID: ${id}. Error: ${error.message}`,
        { stack: error.stack }
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching the profile.'
      );
    }
  }

  /**
   * Updates an existing profile.
   * @param id - The ID of the profile to update.
   * @param updateProfileDto - Data transfer object containing updated profile details.
   * @returns The updated Profile entity.
   */
  async update(
    id: string,
    updateProfileDto: UpdateProfileDto
  ): Promise<Profile> {
    this.logger.info(`Updating profile with ID: ${id}`);
    try {
      const profile = await this.findOne(id);
      Object.assign(profile, updateProfileDto);
      const updatedProfile = await this.profileRepository.save(profile);
      this.logger.info(`Profile with ID: ${id} updated successfully`);
      return updatedProfile;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update profile with ID: ${id}. Error: ${error.message}`,
        { stack: error.stack }
      );
      throw new InternalServerErrorException(
        'An error occurred while updating the profile.'
      );
    }
  }

  /**
   * Removes a profile by ID.
   * @param id - The ID of the profile to remove.
   */
  async remove(id: string): Promise<void> {
    this.logger.info(`Removing profile with ID: ${id}`);
    try {
      const profile = await this.findOne(id);
      await this.profileRepository.remove(profile);
      this.logger.info(`Profile with ID: ${id} removed successfully`);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to remove profile with ID: ${id}. Error: ${error.message}`,
        { stack: error.stack }
      );
      throw new InternalServerErrorException(
        'An error occurred while removing the profile.'
      );
    }
  }
}

import {
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LocationDto } from 'src/utils/dto/location.dto';

export class CreateProfileDto {
  @ApiPropertyOptional({ description: 'URL to the profile picture' })
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @ApiPropertyOptional({ description: 'Biography of the user' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Social media links',
    example: {
      twitter: 'https://twitter.com/username',
      linkedin: 'https://linkedin.com/in/username',
      github: 'https://github.com/username',
    },
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Geographical location of the user',
    type: LocationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

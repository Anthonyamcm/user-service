import { IsString, IsEmail, IsOptional, Length, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'AWS Cognito User ID' })
  @IsString()
  readonly cognitoId!: string;

  @ApiProperty({ description: 'Unique username' })
  @IsString()
  @Length(3, 20)
  readonly username!: string;

  @ApiPropertyOptional({ description: 'Display name' })
  @IsString()
  readonly displayName!: string;

  @ApiProperty({ description: 'User email address' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ description: 'User bio' })
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsUrl()
  readonly profilePictureUrl?: string;
}

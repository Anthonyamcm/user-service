import { IsString, IsEmail, IsOptional, Length, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'AWS Cognito User ID' })
  @IsString()
  readonly cognitoId!: string;

  @ApiProperty({ description: 'Unique username' })
  @IsString()
  @Length(3, 20)
  readonly username!: string;

  @ApiPropertyOptional({ description: 'Display name' })
  @IsOptional()
  @IsString()
  readonly displayName?: string;

  @ApiPropertyOptional({ description: 'User email address' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ description: 'User mobile number' })
  @IsOptional()
  @IsString()
  readonly mobile?: string;

  @ApiProperty({ description: 'User date of birth' })
  @IsDate()
  @Type(() => Date)
  readonly dateOfBirth!: Date;
}

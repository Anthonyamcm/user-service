import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Updated email address' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ description: 'Updated username' })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  readonly username?: string;

  @ApiPropertyOptional({ description: 'Updated display name' })
  @IsOptional()
  @IsString()
  readonly displayName?: string;
}

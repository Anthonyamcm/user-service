import { IsString, IsOptional, Length, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  displayName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  bio?: string;

  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @IsOptional()
  preferences?: Record<string, any>;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(0, 100)
  displayName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  bio?: string;

  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @IsOptional()
  preferences?: Record<string, any>;
}

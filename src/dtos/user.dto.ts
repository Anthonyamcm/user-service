import { IsString, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsString()
  @Length(0, 100)
  display_name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone_number?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  display_name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone_number?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class LocationDto {
  @ApiPropertyOptional({
    description: 'Type of the spatial object',
    example: 'Point',
  })
  @IsString()
  @IsEnum(['Point'], { message: 'Type must be Point.' })
  type!: 'Point';

  @ApiPropertyOptional({
    description: 'Coordinates in [longitude, latitude] format',
    example: [-122.4194155, 37.7749295],
  })
  @IsArray({ message: 'Coordinates must be an array of numbers.' })
  @IsNumber({}, { each: true, message: 'Each coordinate must be a number.' })
  @ValidateNested({ each: true })
  @Type(() => Number)
  coordinates!: [number, number];
}

import { IsNotEmpty, IsString } from 'class-validator';

export class NovaContaDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

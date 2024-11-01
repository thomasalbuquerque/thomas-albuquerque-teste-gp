import { IsInt, IsNotEmpty } from 'class-validator';

export class NovaContaDto {
  @IsNotEmpty()
  @IsInt()
  numero!: number;
}

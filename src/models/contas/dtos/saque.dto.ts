import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SaqueDto {
  @IsNotEmpty()
  @IsInt()
  numero!: number;

  @IsNotEmpty()
  @IsNumber()
  valor!: number;
}

import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DepositoDto {
  @IsNotEmpty()
  @IsInt()
  numero!: number;

  @IsNotEmpty()
  @IsNumber()
  valor!: number;
}

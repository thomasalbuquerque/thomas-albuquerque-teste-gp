import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class NovaContaDto {
  @IsNotEmpty()
  @IsInt()
  numero!: number;

  @IsOptional()
  @IsNumber()
  saldo?: number;
}

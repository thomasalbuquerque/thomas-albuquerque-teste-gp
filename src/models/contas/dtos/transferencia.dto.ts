import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferenciaDto {
  @IsNotEmpty()
  @IsNumber()
  origem!: number;

  @IsNotEmpty()
  @IsNumber()
  destino!: number;

  @IsNotEmpty()
  @IsNumber()
  valor!: number;
}

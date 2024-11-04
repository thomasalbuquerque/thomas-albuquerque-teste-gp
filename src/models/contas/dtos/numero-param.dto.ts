import { IsNumberString } from 'class-validator';

export class NumeroParamDto {
  @IsNumberString()
  numero: string;
}

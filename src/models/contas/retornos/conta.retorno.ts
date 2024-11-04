import { Conta, Transferencia } from '@prisma/client';
import { TransferenciaRetorno } from './transferencia.retorno';

type ContaCriadaRetornoProps = Conta & {
  transferenciasDeSaida?: Transferencia[];
  transferenciasDeEntrada?: Transferencia[];
};

export class ContaRetorno {
  id: number;
  numero: number;
  saldo: number;
  createdAt: Date;
  updatedAt: Date;
  transferenciasDeSaida?: TransferenciaRetorno[];
  transferenciasDeEntrada?: TransferenciaRetorno[];

  constructor(props: ContaCriadaRetornoProps) {
    this.id = props.id;
    this.numero = props.numero;
    this.saldo = props.saldo.toNumber();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.transferenciasDeSaida = props.transferenciasDeSaida
      ? props.transferenciasDeSaida.map(
          (transferencia) => new TransferenciaRetorno(transferencia),
        )
      : undefined;
    this.transferenciasDeEntrada = props.transferenciasDeEntrada
      ? props.transferenciasDeEntrada.map(
          (transferencia) => new TransferenciaRetorno(transferencia),
        )
      : undefined;
  }
}

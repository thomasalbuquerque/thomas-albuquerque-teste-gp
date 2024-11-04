import { Transferencia, TransferenciaStatus } from '@prisma/client';

type TransferenciaRetornoProps = Transferencia;

export class TransferenciaRetorno {
  id: number;
  valor: number;
  contaOrigemId: number;
  contaDestinoId: number;
  status: TransferenciaStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: TransferenciaRetornoProps) {
    this.id = props.id;
    this.valor = props.valor.toNumber();
    this.contaOrigemId = props.contaOrigemId;
    this.contaDestinoId = props.contaDestinoId;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

import { Deposito, DepositoStatus } from '@prisma/client';

type DepositoRetornoProps = Deposito;

export class DepositoRetorno {
  id: number;
  valor: number;
  contaId: number;
  status: DepositoStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: DepositoRetornoProps) {
    this.id = props.id;
    this.valor = props.valor.toNumber();
    this.contaId = props.contaId;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

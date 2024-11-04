import { Saque, SaqueStatus } from '@prisma/client';

type SaqueRetornoProps = Saque;

export class SaqueRetorno {
  id: number;
  valor: number;
  contaId: number;
  status: SaqueStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: SaqueRetornoProps) {
    this.id = props.id;
    this.valor = props.valor.toNumber();
    this.contaId = props.contaId;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

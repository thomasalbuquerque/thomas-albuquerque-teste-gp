import { Conta } from '@prisma/client';

type ContaCriadaRetornoProps = Conta;

export class ContaCriadaRetorno {
  id: number;
  numero: number;
  saldo: number;
  createdAt: Date;

  constructor(props: ContaCriadaRetornoProps) {
    this.id = props.id;
    this.numero = props.numero;
    this.saldo = props.saldo.toNumber();
    this.createdAt = props.createdAt;
  }
}

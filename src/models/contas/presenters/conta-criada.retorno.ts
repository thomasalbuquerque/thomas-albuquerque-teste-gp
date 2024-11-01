import { Conta } from '@prisma/client';

type ContaCriadaRetornoProps = Conta;

export class ContaCriadaRetorno {
  id: number;
  name: string;
  balance: number;
  createdAt: Date;

  constructor(props: ContaCriadaRetornoProps) {
    this.id = props.id;
    this.name = props.name;
    this.balance = props.balance.toNumber();
    this.createdAt = props.createdAt;
  }
}

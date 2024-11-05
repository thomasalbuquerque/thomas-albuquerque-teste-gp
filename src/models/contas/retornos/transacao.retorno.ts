import { StatusTransacao, TipoTransacao, Transacao } from '@prisma/client';

type TransacaoRetornoProps = Transacao & {
  contaOrigem?: {
    numero: number;
  };
  contaDestino?: {
    numero: number;
  };
};

export class TransacaoRetorno {
  id: number;
  tipo: TipoTransacao;
  origem: number;
  destino?: number;
  valor: number;
  conta?: number;
  status: StatusTransacao;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: TransacaoRetornoProps) {
    this.id = props.id;
    this.tipo = props.tipo;
    this.origem =
      props.tipo === TipoTransacao.DEPOSITO ||
      props.tipo === TipoTransacao.SAQUE
        ? undefined
        : props.contaOrigem?.numero;
    this.destino = props.contaDestino ? props.contaDestino.numero : undefined;
    this.valor = props.valor.toNumber();
    this.conta =
      props.tipo === TipoTransacao.TRANSFERENCIA
        ? undefined
        : props.contaOrigem?.numero;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

import { Conta, Transacao } from '@prisma/client';
import { TransacaoRetorno } from './transacao.retorno';

type ContaCriadaRetornoProps = Conta & {
  transacosDeSaida?: Transacao[];
  transacoesDeEntrada?: Transacao[];
};

export class ContaRetorno {
  id: number;
  numero: number;
  saldo: number;
  createdAt: Date;
  updatedAt: Date;
  transacoesDeSaida?: TransacaoRetorno[];
  transacoesDeEntrada?: TransacaoRetorno[];

  constructor(props: ContaCriadaRetornoProps) {
    this.id = props.id;
    this.numero = props.numero;
    this.saldo = props.saldo.toNumber();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.transacoesDeSaida = props.transacosDeSaida
      ? props.transacosDeSaida.length > 0
        ? props.transacosDeSaida.map(
            (transacao) => new TransacaoRetorno(transacao),
          )
        : undefined
      : undefined;
    this.transacoesDeEntrada = props.transacoesDeEntrada
      ? props.transacoesDeEntrada.length > 0
        ? props.transacoesDeEntrada.map(
            (transacao) => new TransacaoRetorno(transacao),
          )
        : undefined
      : undefined;
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ContasService } from '@/models/contas/contas.service';
import { NovaContaDto } from '@/models/contas/dtos/nova-conta.dto';
import { ContaCriadaRetorno } from '@/models/contas/presenters/conta-criada.retorno';

@Controller('contas')
export class ContasController {
  constructor(private readonly contasService: ContasService) {}

  @Post()
  criaConta(@Body() novaContaDto: NovaContaDto): Promise<ContaCriadaRetorno> {
    return this.contasService.criaConta(novaContaDto);
  }
}

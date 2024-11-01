import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContasService } from '@/models/contas/contas.service';
import { NovaContaDto } from './dtos/nova-conta.dto';
import { ContaCriadaRetorno } from './presenters/conta-criada.retorno';

@Controller('contas')
export class ContasController {
  constructor(private readonly accountService: ContasService) {}

  @Post()
  criaConta(@Body() novaContaDto: NovaContaDto): Promise<ContaCriadaRetorno> {
    return this.accountService.criaConta(novaContaDto);
  }
}

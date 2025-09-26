import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto } from '../dto';
import { Customer } from '../entities';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomersService, PaginatedResult } from './customers.service';

@ApiTags('customers')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Cliente criado com sucesso',
    type: Customer 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'CNPJ já existe' })
  async create(@Body() createCustomersDto: CreateCustomerDto): Promise<Customer> {
    return await this.customersService.create(createCustomersDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'razaoSocial', required: false, type: String, description: 'Buscar por razão social' })
  @ApiQuery({ name: 'cnpj', required: false, type: String, description: 'Buscar por CNPJ' })
  @ApiQuery({ name: 'status', required: false, enum: ['ativo', 'inativo'], description: 'Filtrar por status' })
  @ApiQuery({ name: 'conectaPlus', required: false, type: Boolean, description: 'Filtrar por Conecta Plus' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de clientes paginada' 
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async findAll(@Query() query: QueryCustomerDto): Promise<PaginatedResult<Customer>> {
    return await this.customersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do cliente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente encontrado',
    type: Customer 
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do cliente' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente atualizado com sucesso',
    type: Customer 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'CNPJ já existe' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customersService.update(id, UpdateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar cliente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do cliente' })
  @ApiResponse({ status: 204, description: 'Cliente deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.customersService.remove(id);
  }
}
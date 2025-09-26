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
import { UsersService, PaginatedResult } from './users.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from '../dto';
import { User } from '../entities';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    type: User 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por nome ou email' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Campo para ordenação' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Ordem da classificação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários paginada' 
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async findAll(@Query() query: QueryUserDto): Promise<PaginatedResult<User>> {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário encontrado',
    type: User 
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    type: User 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.usersService.remove(id);
  }
}
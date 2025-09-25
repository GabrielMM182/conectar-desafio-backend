import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from '../dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
      const userData = { ...createUserDto };
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      if (!userData.role) {
        userData.role = UserRole.USER;
      }

      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async findAll(query?: QueryUserDto): Promise<PaginatedResult<User>> {
    const page = parseInt(query?.page || '1');
    const limit = parseInt(query?.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (query?.name) {
      where.name = Like(`%${query.name}%`);
    }
    
    if (query?.email) {
      where.email = Like(`%${query.email}%`);
    }
    
    if (query?.role) {
      where.role = query.role;
    }

    const findOptions: FindManyOptions<User> = {
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    };

    const [data, total] = await this.userRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<User> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('Email é obrigatório');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingUser = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });

      if (emailExists) {
        throw new ConflictException('Email já está em uso');
      }
    }

    try {
      const updateData = { ...updateUserDto };

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      await this.userRepository.update(id, updateData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar usuário');
    }
  }

  async remove(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    await this.findOne(id);

    try {
      const result = await this.userRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao remover usuário');
    }
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async findByEmailOptional(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
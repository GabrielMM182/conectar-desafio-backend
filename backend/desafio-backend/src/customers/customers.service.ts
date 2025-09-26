import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Customer, CustomerStatus } from '../entities';
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto } from '../dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly CustomerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const existingCustomer = await this.CustomerRepository.findOne({
        where: { cnpj: createCustomerDto.cnpj }
      });

      if (existingCustomer) {
        throw new ConflictException('CNPJ já está em uso');
      }

      const customerData = { 
        ...createCustomerDto,
        status: createCustomerDto.status || CustomerStatus.ATIVO,
        conectaPlus: createCustomerDto.conectaPlus || false
      };

      const customer = this.CustomerRepository.create(customerData);
      return await this.CustomerRepository.save(customer);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar cliente');
    }
  }

  async findAll(query?: QueryCustomerDto): Promise<PaginatedResult<Customer>> {
    const page = parseInt(query?.page || '1');
    const limit = parseInt(query?.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (query?.razaoSocial) {
      where.razaoSocial = Like(`%${query.razaoSocial}%`);
    }
    
    if (query?.cnpj) {
      where.cnpj = query.cnpj;
    }
    
    if (query?.status) {
      where.status = query.status;
    }

    if (query?.conectaPlus !== undefined) {
      where.conectaPlus = query.conectaPlus;
    }

    const findOptions: FindManyOptions<Customer> = {
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    };

    const [data, total] = await this.CustomerRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Customer> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const customer = await this.CustomerRepository.findOne({ where: { id } });
    
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    return customer;
  }

  async findByCnpj(cnpj: string): Promise<Customer> {
    if (!cnpj) {
      throw new BadRequestException('CNPJ é obrigatório');
    }

    const customer = await this.CustomerRepository.findOne({ where: { cnpj } });
    
    if (!customer) {
      throw new NotFoundException(`Cliente com CNPJ ${cnpj} não encontrado`);
    }
    
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const existingCustomer = await this.findOne(id);

    if (updateCustomerDto.cnpj && updateCustomerDto.cnpj !== existingCustomer.cnpj) {
      const cnpjExists = await this.CustomerRepository.findOne({
        where: { cnpj: updateCustomerDto.cnpj }
      });

      if (cnpjExists) {
        throw new ConflictException('CNPJ já está em uso');
      }
    }

    try {
      await this.CustomerRepository.update(id, updateCustomerDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar cliente');
    }
  }

  async remove(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    await this.findOne(id);

    try {
      const result = await this.CustomerRepository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao remover cliente');
    }
  }

  async findByCnpjOptional(cnpj: string): Promise<Customer | null> {
    return await this.CustomerRepository.findOne({ where: { cnpj } });
  }

  async findActiveCustomers(): Promise<Customer[]> {
    return await this.CustomerRepository.find({
      where: { status: CustomerStatus.ATIVO },
      order: { createdAt: 'DESC' }
    });
  }

  async findConectaPlusCustomers(): Promise<Customer[]> {
    return await this.CustomerRepository.find({
      where: { conectaPlus: true },
      order: { createdAt: 'DESC' }
    });
  }
}
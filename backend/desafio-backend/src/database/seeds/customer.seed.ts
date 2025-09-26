import { DataSource } from 'typeorm';
import { Customer, CustomerStatus } from '../../entities/customer.entity';

export class CustomerSeeder {
    public static async run(dataSource: DataSource): Promise<void> {
        const customerRepository = dataSource.getRepository(Customer);

        const existingCustomers = await customerRepository.count();
        if (existingCustomers > 0) {
            console.log('Customers already exist, skipping seed...');
            return;
        }

        const customers = [
            {
                razaoSocial: 'Tech Solutions Ltda',
                cnpj: '12.345.678/0001-90',
                nomeFachada: 'TechSol',
                tags: ['tecnologia', 'software', 'b2b'],
                status: CustomerStatus.ATIVO,
                conectaPlus: true,
            },
            {
                razaoSocial: 'Comercial ABC S.A.',
                cnpj: '98.765.432/0001-10',
                nomeFachada: 'ABC Comércio',
                tags: ['varejo', 'comercio'],
                status: CustomerStatus.ATIVO,
                conectaPlus: false,
            },
            {
                razaoSocial: 'Indústria XYZ Ltda',
                cnpj: '11.222.333/0001-44',
                nomeFachada: 'XYZ Industrial',
                tags: ['industria', 'manufatura', 'b2b'],
                status: CustomerStatus.ATIVO,
                conectaPlus: true,
            },
            {
                razaoSocial: 'Startup Inovação ME',
                cnpj: '55.666.777/0001-88',
                nomeFachada: 'InovaTech',
                tags: ['startup', 'inovacao', 'tecnologia'],
                status: CustomerStatus.ATIVO,
                conectaPlus: false,
            },
            {
                razaoSocial: 'Serviços Gerais Ltda',
                cnpj: '33.444.555/0001-22',
                nomeFachada: 'ServiGeral',
                tags: ['servicos', 'consultoria'],
                status: CustomerStatus.INATIVO,
                conectaPlus: false,
            },
            {
                razaoSocial: 'E-commerce Plus S.A.',
                cnpj: '77.888.999/0001-66',
                nomeFachada: 'EcomPlus',
                tags: ['ecommerce', 'digital', 'varejo'],
                status: CustomerStatus.ATIVO,
                conectaPlus: true,
            },
            {
                razaoSocial: 'Consultoria Estratégica Ltda',
                cnpj: '22.333.444/0001-55',
                nomeFachada: 'ConEstrategica',
                tags: ['consultoria', 'estrategia', 'b2b'],
                status: CustomerStatus.ATIVO,
                conectaPlus: true,
            },
            {
                razaoSocial: 'Logística Express ME',
                cnpj: '66.777.888/0001-99',
                nomeFachada: 'LogExpress',
                tags: ['logistica', 'transporte'],
                status: CustomerStatus.INATIVO,
                conectaPlus: false,
            },
            {
                razaoSocial: 'Alimentícia Sabor Ltda',
                cnpj: '44.555.666/0001-33',
                nomeFachada: 'Sabor & Cia',
                tags: ['alimenticio', 'industria', 'b2c'],
                status: CustomerStatus.ATIVO,
                conectaPlus: false,
            },
            {
                razaoSocial: 'Financeira Digital S.A.',
                cnpj: '88.999.000/0001-77',
                nomeFachada: 'FinDigital',
                tags: ['fintech', 'digital', 'financeiro'],
                status: CustomerStatus.ATIVO,
                conectaPlus: true,
            },
        ];

        for (const customerData of customers) {
            const customer = customerRepository.create(customerData);
            await customerRepository.save(customer);
            console.log(`Created customer: ${customer.razaoSocial} (${customer.cnpj})`);
        }

        console.log('Customer seeding completed!');
    }
}
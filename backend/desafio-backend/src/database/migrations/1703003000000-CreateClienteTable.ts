import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomerTable1703003000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'customers',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'razaoSocial',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'cnpj',
                        type: 'varchar',
                        length: '18',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'nomeFachada',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'tags',
                        type: 'json',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'ativo'",
                        isNullable: false,
                    },
                    {
                        name: 'conectaPlus',
                        type: 'boolean',
                        default: false,
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('customers');
    }
}
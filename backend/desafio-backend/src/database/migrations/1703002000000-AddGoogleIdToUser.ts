import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGoogleIdToUser1703002000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'googleId',
                type: 'varchar',
                length: '255',
                isNullable: true,
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'googleId');
    }
}
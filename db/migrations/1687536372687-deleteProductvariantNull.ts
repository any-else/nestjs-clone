import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteProductvariantNull1687536372687
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM products_variant WHERE product_id IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

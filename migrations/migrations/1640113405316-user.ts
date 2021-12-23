import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1640113405316 implements MigrationInterface {
  name: string = 'User1640113405316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "User" ADD "role" character varying NOT NULL DEFAULT \'user\'',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "User" DROP COLUMN "role"', undefined);
  }
}

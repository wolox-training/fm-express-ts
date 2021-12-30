import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sale1640882562489 implements MigrationInterface {
  name: string = 'sale1640882562489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "Sale" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "card_id" character varying NOT NULL, CONSTRAINT "PK_dc216b1140b34718ae74c8e1273" PRIMARY KEY ("id"))',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "Sale"', undefined);
  }
}

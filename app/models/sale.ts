import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'Sale' })
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'card_id', type: 'varchar' })
  cardId: string;
}

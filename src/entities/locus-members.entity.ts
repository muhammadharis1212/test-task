import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Locus } from './locus.entity';

@Entity('rnc_locus_members', { schema: 'rnacen' })
export class LocusMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urs_taxid: string;

  @Column()
  region_id: string;

  @Column()
  membership_status: string;

  @ManyToOne(() => Locus, locus => locus.locus_members)
  @JoinColumn({ name: 'locus_id' })
  locus: Locus; // This property represents the many-to-one relationship
}

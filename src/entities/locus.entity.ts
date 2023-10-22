import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LocusMembers } from './locus-members.entity';

@Entity('rnc_locus', { schema: 'rnacen' })
export class Locus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assembly_id: string;

  @Column()
  locus_name: string;

  @Column()
  public_locus_name: string;

  @Column()
  chromosome: string;

  @Column()
  strand: string;

  @Column()
  locus_start: number;

  @Column()
  locus_stop: number;

  @Column()
  member_count: number;

  @OneToMany(() => LocusMembers, locusMembers => locusMembers.locus)
  locus_members: LocusMembers[]; // This property represents the one-to-many relationship
}

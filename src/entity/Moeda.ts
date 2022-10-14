import { Periodo } from './Periodo';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Moeda extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, length: 50 })
    nroSerie: string;

    @Column({ nullable: false, length: 1 })
    perdido: string;

    @Column({nullable: false})
    fabricacao: Date;

    @ManyToOne(() => Periodo, {eager: true, nullable: false})
    periodo: Periodo;

    @Column({ nullable: false, length: 1 })
    ativo: string;

    @Column({ nullable: false, length: 1024 })
    obs: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

import { Periodo } from './Periodo';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from './Usuario';

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

    @ManyToOne(() => Usuario, {eager: true, nullable: false})
    usuario: Usuario;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
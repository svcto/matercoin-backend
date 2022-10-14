
import { Moeda } from './Moeda';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Usuario } from './Usuario';

@Entity()
export class Movimentacao extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    transferencia: Date;

    @ManyToOne(() => Moeda, {eager: true, nullable: false})
    moeda: Moeda;

    @ManyToOne(() => Usuario, {eager: true, nullable: false})
    origem: Usuario;

    @ManyToOne(() => Usuario, {eager: true, nullable: false})
    destino: Usuario;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
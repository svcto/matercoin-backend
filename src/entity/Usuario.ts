
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate, ManyToOne } from "typeorm";
import { Moeda } from "./Moeda";
import bcrypt from 'bcryptjs'
import { Periodo } from "./Periodo";
export enum ETipoUsuario {
    ALUNO,
    PROFESSOR,
    COORDENADOR,
    PROFESSOR_COORDENADOR
}

@Entity()
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ETipoUsuario,
        default: ETipoUsuario.ALUNO
    })
    tipo: ETipoUsuario;

    @Column({ nullable: false, length: 50 })
    nome: string;

    @Column({ nullable: false, length: 50 })
    ra: string;

    @Column({ nullable: false, length: 50 })
    senha: string;

    @Column({ nullable: false, length: 255 })
    email: string;

    @Column({ nullable: false, length: 255 })
    contato: string;

    @Column({ nullable: false, length: 1 })
    ativo: string;

    @Column("decimal", { precision: 2, scale: 2 })
    saldo: number;

    @Column({ nullable: false, length: 1024 })
    condicoes: string;

    @Column({ nullable: false, length: 1024 })
    obs: string;

    @OneToMany((type) => Moeda, (t) => t.usuario)
    moedas: Moeda[];

    @ManyToOne(() => Periodo, {eager: true, nullable: true})
    periodo: Periodo;

    @BeforeInsert()
    @BeforeUpdate()

    hashPassword() {
        this.senha = bcrypt.hashSync(this.senha, 8)
    }

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    
}
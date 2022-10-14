import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    
}
import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTablePosts1645664356942 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS Posts (
                id INT PRIMARY KEY AUTO_INCREMENT,  
                userId INT NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                text VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT(UTC_TIMESTAMP()) NOT NULL,
                deletedAt TIMESTAMP,
                CONSTRAINT fk_user 
                    FOREIGN KEY(userId) 
                    REFERENCES Users(id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS Users
        `);
    }
}
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5431,
  username: 'postgres',
  password: 'pass1234',
  database: 'taskmanagement',
  autoLoadEntities: true,
  synchronize: true,
};

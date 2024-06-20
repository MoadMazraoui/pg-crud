import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { LeaveController } from './leave/leave.controller';
import { LeaveService } from './leave/leave.service';
import { Leave } from './leave/entities/leave.entity';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // host: configService.get('DB_HOST'),
        // port: +configService.get('DB_PORT'),
        // username: configService.get('DB_USERNAME'),
        // password: configService.get('DB_PASSWORD'),
        // database: configService.get('DB_NAME'),
        "host": "127.0.0.1",
        "port": 5432,
        "username": "dev",
        "password": "secret",
        "database": "demodb",
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Leave]),
  ],
  controllers: [UserController, LeaveController],
  providers: [UserService, LeaveService, MailService],
})
export class AppModule {}

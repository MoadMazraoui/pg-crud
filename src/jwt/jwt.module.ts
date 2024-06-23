import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt/jwt.strategy'; 
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    JwtStrategy,
    UserService,
  ],
  exports: [
    JwtStrategy,
  ],
})
export class JwtModule {}

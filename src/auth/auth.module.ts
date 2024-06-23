import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [UserModule],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}

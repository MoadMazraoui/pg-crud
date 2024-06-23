import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { Leave } from './entities/leave.entity';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Leave]), UserModule],
  providers: [LeaveService, MailService],
  controllers: [LeaveController],
})
export class LeaveModule {}

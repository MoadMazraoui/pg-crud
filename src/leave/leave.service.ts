import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from './entities/leave.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { MailService } from '../mail.service';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async requestLeave(userId: string, reason: string, startDate: Date, endDate: Date): Promise<Leave> {
    const leaveDays = this.calculateLeaveDays(startDate, endDate);

    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const totalRequestedDays = leaveDays;
    if (totalRequestedDays > user.reliquatConge + user.reliquatN_1) {
      throw new Error('Requested leave exceeds available balance');
    }

    const newLeave = this.leaveRepository.create({
      reason,
      startDate,
      endDate,
      status: 'pending',
      user,
    });
    
    await this.sendNotificationEmailToAdmin(reason, startDate, endDate);
    
    return await this.leaveRepository.save(newLeave);
  }

  async approveLeave(leaveId: string): Promise<Leave> {
    const leave = await this.leaveRepository.findOneBy({id: leaveId });
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${leaveId} not found`);
    }

    leave.status = 'approved';

    const leaveDays = this.calculateLeaveDays(leave.startDate, leave.endDate);
    leave.user.reliquatConge -= leaveDays;
    leave.user.congeConsomme += leaveDays;

    await this.sendNotificationEmailToUser(leave.user.email, 'Leave Approved', 'Your leave request has been approved.');
    
    await this.updateUserLeaveBalances(leave.user, leaveDays);

    await this.userRepository.save(leave.user);

    return await this.leaveRepository.save(leave);
  }

  async rejectLeave(leaveId: string): Promise<Leave> {
    const leave = await this.leaveRepository.findOneBy({id: leaveId});
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${leaveId} not found`);
    }

    leave.status = 'rejected';

    await this.sendNotificationEmailToUser(leave.user.email, 'Leave Rejected', 'Your leave request has been rejected.');

    return await this.leaveRepository.save(leave);
  }
  async getLeaveById(id: string): Promise<Leave> {
    const leave = await this.leaveRepository.findOneBy({id: id});
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }
  async getAllLeaves(): Promise<Leave[]> {
    return await this.leaveRepository.find();
  }
  private calculateLeaveDays(startDate: Date, endDate: Date): number {
    let leaveDays = 0;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { 
        leaveDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1); 
    }
    return leaveDays;
  }
  private async updateUserLeaveBalances(user: User, leaveDays: number): Promise<void> {
    user.reliquatConge -= leaveDays;
    user.congeConsomme += leaveDays;
    await this.userRepository.save(user);
  }
  private async sendNotificationEmailToUser(to: string, subject: string, message: string): Promise<void> {
    await this.mailService.sendMail(to, subject, message);
    console.log(`Notification sent to ${to}: ${subject} - ${message}`);
  }

  private async sendNotificationEmailToAdmin(reason: string, startDate: Date, endDate: Date): Promise<void> {
    const adminEmail = 'mazraoui3@gmail.com';
    const subject = 'New Leave Request';
    const message = `New leave request:\nReason: ${reason}\nStart Date: ${startDate}\nEnd Date: ${endDate}`;
    
    await this.mailService.sendMail(adminEmail, subject, message);
  }
}

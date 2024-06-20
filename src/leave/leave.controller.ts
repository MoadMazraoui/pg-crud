import { Controller, Get, Post, Body, Param, Put, NotFoundException } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { Leave } from './entities/leave.entity';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async requestLeave(
    @Body('userId') userId: string,
    @Body('reason') reason: string,
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
  ): Promise<Leave> {
    try {
      return await this.leaveService.requestLeave(userId, reason, startDate, endDate);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id/approve')
  async approveLeave(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.approveLeave(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id/reject')
  async rejectLeave(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.rejectLeave(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  async getLeaveById(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.getLeaveById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async getAllLeaves(): Promise<Leave[]> {
    return await this.leaveService.getAllLeaves();
  }
}

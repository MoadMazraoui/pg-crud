import { Controller, Get, Post, Body, Param, Put, NotFoundException, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { Leave } from './entities/leave.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'; 
import { RolesGuard } from '../roles-guard/roles.guard';
import { Roles } from '../roles-decorator/roles.decorator'; 

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @UseGuards(JwtAuthGuard) 
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
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async approveLeave(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.approveLeave(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id/reject')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async rejectLeave(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.rejectLeave(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelLeave(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.cancelLeave(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getLeaveById(@Param('id') id: string): Promise<Leave> {
    try {
      return await this.leaveService.getLeaveById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllLeaves(): Promise<Leave[]> {
    return await this.leaveService.getAllLeaves();
  }
}

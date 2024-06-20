import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Res,
  Param,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { CreateUserDto } from 'src/dtos/CreateUserDto.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Role } from 'src/types/role.enum';
import { UserService } from 'src/user/service/user/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('')
  getAllUsers(@Res() res: Response) {
    return this.userService.getAllUsers(res);
  }

  @Post('')
  createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new HttpException(
        { message: 'Password does not match , try again', status: 'error' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.createUser(createUserDto, res);
  }

  @Get(':id')
  findOneUser(@Param('id') id: number, @Res() res: Response) {
    return this.userService.findOneUser(id, res);
  }

  @Delete(':id')
  deleteOneUser(@Param('id') id: number, @Res() res: Response) {
    return this.userService.deleteOneUser(id, res);
  }
}

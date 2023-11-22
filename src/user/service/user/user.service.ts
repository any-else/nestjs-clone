import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { User } from 'src/typeorm/entities/User.entity';
import { Role } from 'src/types/role.enum';
import { CreateUserBody } from 'src/types/types';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
  ) {}
  async createUser(createUserDetail: CreateUserBody, res: Response) {
    try {
      const newUser = this.userRespository.create({
        name: createUserDetail.name,
        email: createUserDetail.email,
        phone: createUserDetail.phone,
        address: createUserDetail.address,
        password: createUserDetail.password,
      });

      await this.userRespository.save(newUser);

      return res.status(201).json({
        status: 'success',
        message: 'Create success',
      });
    } catch (err) {
      console.log(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          status: 'error',
          message: 'Email or Phone already exists',
        });
      } else if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
        return res.status(400).json({
          status: 'error',
          message:
            'Please check gender (male, female, other) , role (user, seller , admin)',
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: err.message,
        });
      }
    }
  }

  async getAllUsers(res: Response) {
    try {
      const users = await this.userRespository.find({
        where: {
          role: Role.User,
        },
      });
      return res.status(200).json({
        status: 'success',
        users,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findOneUser(id: number, res: Response) {
    try {
      const user = await this.userRespository.findOne({
        where: {
          _id: id,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return res.status(200).json({
        status: 'success',
        user,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteOneUser(id: number, res: Response) {
    try {
      const user = await this.userRespository.findOne({
        where: {
          _id: id,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      await this.userRespository.remove(user);
      return res.status(200).json({
        status: 'success',
        message: 'Delete success',
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}

import { Response } from 'express';
import { User } from 'src/typeorm/entities/User.entity';
import { CreateUserBody } from 'src/types/types';
import { Repository } from 'typeorm';
export declare class UserService {
    private userRespository;
    constructor(userRespository: Repository<User>);
    createUser(createUserDetail: CreateUserBody, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllUsers(res: Response): Promise<Response<any, Record<string, any>>>;
    findOneUser(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteOneUser(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

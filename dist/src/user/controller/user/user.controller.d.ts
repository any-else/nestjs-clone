import { Response } from 'express';
import { CreateUserDto } from 'src/dtos/CreateUserDto.dto';
import { UserService } from 'src/user/service/user/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(res: Response): Promise<Response<any, Record<string, any>>>;
    createUser(createUserDto: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneUser(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteOneUser(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Booking, BookingStatus, Order } from 'src/typeorm/entities/Booking.entity';
import { Repository } from 'typeorm';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { inforBooking } from 'src/types/types';
import { Cart } from 'src/typeorm/entities/Cart.entity';
export declare class BookingService {
    private configService;
    private bookingRepository;
    private orderRepository;
    private statusRepository;
    private productVariantSizeRepository;
    private userRepository;
    private cartRepository;
    private stripe;
    constructor(configService: ConfigService, bookingRepository: Repository<Booking>, orderRepository: Repository<Order>, statusRepository: Repository<BookingStatus>, productVariantSizeRepository: Repository<ProductVariantSize>, userRepository: Repository<User>, cartRepository: Repository<Cart>);
    createStatus(statusName: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getStatus(res: Response): Promise<Response<any, Record<string, any>>>;
    createBookingCod(orders: {
        quantity: number;
        idProd: number;
    }[], infor: inforBooking, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    charge(orders: {
        quantity: number;
        idProd: number;
    }[], infor: inforBooking, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    check(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    findOrders(idStatus: number, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findOrdersAllUsers(idStatus: number, res: Response): Promise<Response<any, Record<string, any>>>;
    findBookingById(idBooking: number, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatusService(idBooking: number, idStatus: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getBookingByUser(idUser: number, idStatus: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

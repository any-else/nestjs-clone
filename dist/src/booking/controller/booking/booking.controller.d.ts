import { Request, Response } from 'express';
import { BookingService } from 'src/booking/service/booking/booking.service';
import { CreateStatus } from 'src/dtos/CreateStatus.dto';
import { CreateChargeDto } from 'src/dtos/CreateStripe.dto';
export declare class BookingController {
    private stripeService;
    constructor(stripeService: BookingService);
    createCharge(charge: CreateChargeDto, request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
    getAllOrders(res: Response, idStatus: number): Promise<Response<any, Record<string, any>>>;
    getBookingUser(idUser: number, res: Response, idStatus: number): Promise<Response<any, Record<string, any>>>;
    stripeController(body: {
        id: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    paypalController(charge: CreateChargeDto, request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
    statusController(body: CreateStatus, res: Response): Promise<Response<any, Record<string, any>>>;
    getStatusController(res: Response): Promise<Response<any, Record<string, any>>>;
    getOrders(req: Request, res: Response, idStatus: number): Promise<Response<any, Record<string, any>>>;
    findBookingById(idBooking: number, request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
    changeStatus(idBooking: number, body: {
        idStatus: number;
    }, response: Response): Promise<Response<any, Record<string, any>>>;
}

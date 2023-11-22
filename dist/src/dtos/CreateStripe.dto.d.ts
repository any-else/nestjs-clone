import { InforBooking } from './InforBooking.dto';
export declare class CreateStripe {
    name: string;
    email: string;
}
export declare class CreateChargeDto {
    orders: Order[];
    infor: InforBooking;
}
declare class Order {
    quantity: number;
    idProd: number;
}
export {};

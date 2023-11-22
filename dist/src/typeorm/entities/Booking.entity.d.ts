import { User } from './User.entity';
import { ProductVariantSize } from './ProductVariantSize.entity';
export declare class BookingStatus {
    _id: number;
    name: string;
    bookings: Booking[];
}
export declare class Booking {
    _id: number;
    country: string;
    first_name: string;
    last_name: string;
    address: string;
    apartment: string;
    city: string;
    postal_code: string;
    phone: string;
    email: string;
    status: BookingStatus;
    user: User;
    order: Order[];
    total: number;
    payment_method: string;
    brand: string;
    transaction_id: string;
}
export declare class Order {
    _id: number;
    quantity: number;
    product: ProductVariantSize;
    bookings: Booking;
    new_price: number;
    createdAt: Date;
    calPrice(): void;
}

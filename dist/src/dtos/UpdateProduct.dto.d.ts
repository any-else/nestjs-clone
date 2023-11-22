export declare class UpdateVariant {
    colorId: number;
    sizeId: number;
    price: number;
    sale: number;
    quantity: number;
}
export declare class UpdateProduct {
    name: string;
    description: string;
    tags: string;
    material: string;
    prod_variant: {
        colorId: number;
        sizeId: number;
        price: number;
        sale: number;
        quantity: number;
    }[];
}

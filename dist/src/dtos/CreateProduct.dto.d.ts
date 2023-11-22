export declare class Variant {
    colorId: number;
    sizeId: number;
    price: number;
    sale: number;
    quantity: number;
}
export declare class CreateProduct {
    name: string;
    description: string;
    tags: string;
    material: string;
    category: {
        _id: number;
        category_name: string;
        active: boolean;
        collection: {
            _id: number;
            collection_name: string;
            active: boolean;
        };
    };
    prod_variant: {
        color: {
            _id: number;
            color_name: string;
            image_color: string;
        };
        size: {
            _id: number;
            size_name: string;
        };
        price: number;
        sale: number;
        quantity: number;
    }[];
}

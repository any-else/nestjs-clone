import { Category } from './Category.entity';
export declare class Collection {
    _id: number;
    collection_name: string;
    active: boolean;
    image_collection: string;
    categories: Category[];
}

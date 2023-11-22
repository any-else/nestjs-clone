/// <reference types="multer" />
import { Request, Response } from 'express';
import { CreateCollection } from 'src/dtos/CreateCollection.dto';
import { UpdateCollection } from 'src/dtos/UpdateCollection.dto';
import { CollectionService } from 'src/product/service/collection/collection.service';
export declare class CollectionController {
    private collectionService;
    constructor(collectionService: CollectionService);
    findAllCollection(res: Response): Promise<void>;
    createCollection(createCollectionDto: CreateCollection, res: Response, req: Request): Promise<void>;
    updateCollection(id: number, image_collection: Express.Multer.File, updateCollectionDto: UpdateCollection, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCollection(id: number, res: Response): Promise<void>;
    findOneCollection(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

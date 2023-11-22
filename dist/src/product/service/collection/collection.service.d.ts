/// <reference types="multer" />
import { Request, Response } from 'express';
import { Collection } from 'src/typeorm/entities/Collection.entity';
import { CreateCollectionService, UpdateCollectionService } from 'src/types/types';
import { Repository } from 'typeorm';
export declare class CollectionService {
    private collectionRepository;
    constructor(collectionRepository: Repository<Collection>);
    findAllCollectionService(res: Response): Promise<void>;
    findOneCollectionService(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createCollectionService(createCollectionDetail: CreateCollectionService, res: Response, req: Request): Promise<void>;
    updateCollectionService(id: number, file: Express.Multer.File, updateCollectionDetail: UpdateCollectionService, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCollectionService(id: number, res: Response): Promise<void>;
}

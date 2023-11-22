import { Response } from 'express';
import { Size } from 'src/typeorm/entities/Size.entity';
import { CreateSizeService } from 'src/types/types';
import { Repository } from 'typeorm';
export declare class SizeService {
    private sizeRepository;
    constructor(sizeRepository: Repository<Size>);
    findAllSizeService(res: Response): Promise<void>;
    getSizeCollection(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createSizeService(createSizeDetail: CreateSizeService, res: Response): Promise<void>;
    findEachSize(idSize: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateSizeService(id: number, updateSizeDetail: {
        size_name: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteSizeService(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

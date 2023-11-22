import { Request, Response } from 'express';
import { Color } from 'src/typeorm/entities/Color.entity';
import { CreateColorService, UpdateColorService } from 'src/types/types';
import { Repository } from 'typeorm';
export declare class ColorService {
    private colorReporitory;
    constructor(colorReporitory: Repository<Color>);
    getAllColorService(res: Response): Promise<void>;
    findColorCollection(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneColorService(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createColor(createColorDetail: CreateColorService, res: Response, req: Request): Promise<void>;
    updateColor(id: number, updateColorDetail: UpdateColorService, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteColor(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

import { Response } from 'express';
import { CreateSize } from 'src/dtos/CreateSize.dto';
import { UpdateSizeDto } from 'src/dtos/UpdateSize.dto';
import { SizeService } from 'src/product/service/size/size.service';
export declare class SizeController {
    private sizeService;
    constructor(sizeService: SizeService);
    getSizeCollection(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllSize(res: Response): Promise<void>;
    createSize(createSizeDto: CreateSize, res: Response): Promise<void>;
    findSize(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateSize(id: number, updateSizeDto: UpdateSizeDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteSize(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

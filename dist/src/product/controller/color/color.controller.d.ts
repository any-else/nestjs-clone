import { Request, Response } from 'express';
import { CreateColor } from 'src/dtos/CreateColor.dto';
import { UpdateColor } from 'src/dtos/UpdateColor.dto';
import { ColorService } from 'src/product/service/color/color.service';
export declare class ColorController {
    private colorService;
    constructor(colorService: ColorService);
    getAllColor(res: Response): Promise<void>;
    findColorCollection(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createColor(createColorDto: CreateColor, res: Response, req: Request): Promise<void>;
    updateColor(id: number, updateColorDto: UpdateColor, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteColor(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneColor(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

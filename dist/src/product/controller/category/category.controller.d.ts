import { Response } from 'express';
import { CreateCategory } from 'src/dtos/CreateCategory.dto';
import { UpdateCategory } from 'src/dtos/UpdateCategory.dto';
import { CategoryService } from 'src/product/service/category/category.service';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    getAllCates(res: Response): Promise<Response<any, Record<string, any>>>;
    createCategoryBaseCollection(collection: number, createCatgoryDto: CreateCategory, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllCategory(res: Response, idCollection: number): Promise<Response<any, Record<string, any>>>;
    createCategory(createCategoryDto: CreateCategory, res: Response): Promise<Response<any, Record<string, any>>>;
    addCollection(collectionId: number, categoryId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCategory(idCategory: number, updateCategoryDto: UpdateCategory, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCategory(idCategory: number, res: Response): Promise<Response<any, Record<string, any>>>;
}

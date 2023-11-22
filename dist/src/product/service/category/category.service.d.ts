import { Response } from 'express';
import { Category } from 'src/typeorm/entities/Category.entity';
import { Collection } from 'src/typeorm/entities/Collection.entity';
import { CreateCategoryService, UpdateCategoryService } from 'src/types/types';
import { Repository } from 'typeorm';
export declare class CategoryService {
    private categoryRepository;
    private collectionRepository;
    constructor(categoryRepository: Repository<Category>, collectionRepository: Repository<Collection>);
    createCateBaseCollectionService(collectionId: number, createCategoryDetail: CreateCategoryService, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllCategoryService(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createCategoryService(createCategoryDetail: CreateCategoryService, res: Response): Promise<Response<any, Record<string, any>>>;
    addCollectionToCategory(collectionId: number, categoryId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCategory(idCategory: number, updateCategoryDetail: UpdateCategoryService, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCategoryService(idCategory: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllCats(res: Response): Promise<Response<any, Record<string, any>>>;
}

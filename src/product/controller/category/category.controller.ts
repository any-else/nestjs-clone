import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCategory } from 'src/dtos/CreateCategory.dto';
import { UpdateCategory } from 'src/dtos/UpdateCategory.dto';
import { CategoryService } from 'src/product/service/category/category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  getAllCates(@Res() res: Response) {
    return this.categoryService.getAllCats(res);
  }

  @Post('create-category/:collection')
  createCategoryBaseCollection(
    @Param('collection', ParseIntPipe) collection: number,
    @Body() createCatgoryDto: CreateCategory,
    @Res() res: Response,
  ) {
    return this.categoryService.createCateBaseCollectionService(
      collection,
      createCatgoryDto,
      res,
    );
  }

  @Get(':idCollection/categories')
  getAllCategory(
    @Res() res: Response,
    @Param('idCollection', ParseIntPipe) idCollection: number,
  ) {
    return this.categoryService.getAllCategoryService(idCollection, res);
  }

  @Post('')
  createCategory(
    @Body() createCategoryDto: CreateCategory,
    @Res() res: Response,
  ) {
    return this.categoryService.createCategoryService(createCategoryDto, res);
  }

  @Patch('add-collection/:collectionId/:categoryId')
  addCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Res() res: Response,
  ) {
    return this.categoryService.addCollectionToCategory(
      collectionId,
      categoryId,
      res,
    );
  }

  @Patch('update/:idCategory')
  updateCategory(
    @Param('idCategory', ParseIntPipe) idCategory: number,
    @Body() updateCategoryDto: UpdateCategory,
    @Res() res: Response,
  ) {
    return this.categoryService.updateCategory(
      idCategory,
      updateCategoryDto,
      res,
    );
  }

  @Delete('delete/:idCategory')
  deleteCategory(
    @Param('idCategory', ParseIntPipe) idCategory: number,
    @Res() res: Response,
  ) {
    return this.categoryService.deleteCategoryService(idCategory, res);
  }
}

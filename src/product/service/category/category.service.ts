import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Category } from 'src/typeorm/entities/Category.entity';
import { Collection } from 'src/typeorm/entities/Collection.entity';
import { CreateCategoryService, UpdateCategoryService } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  async createCateBaseCollectionService(
    collectionId: number,
    createCategoryDetail: CreateCategoryService,
    res: Response,
  ) {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { _id: collectionId },
      });
      if (!collection) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found this collection',
        });
      }
      const category = await this.categoryRepository.create(
        createCategoryDetail,
      );
      category.collection = collection;
      await this.categoryRepository.save(category);
      const result = { ...category, length: 0 };
      res.status(200).json({
        status: 'success',
        category: result,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCategoryService(idCollection: number, res: Response) {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { _id: idCollection },
      });
      if (!collection) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found this collection',
        });
      }
      const categories = await this.categoryRepository.find({
        relations: ['products', 'collection'],
        where: {
          collection: {
            _id: collection._id,
          },
        },
      });
      const maps = categories.map((el) => {
        return {
          _id: el._id,
          length: el.products.length,
          category_name: el.category_name,
          active: el.active,
          collection: {
            _id: el.collection._id,
            collection_name: el.collection.collection_name,
          },
        };
      });
      return res.status(200).json({
        status: 'success',
        categories: maps,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createCategoryService(
    createCategoryDetail: CreateCategoryService,
    res: Response,
  ) {
    try {
      const newCategory = await this.categoryRepository.create(
        createCategoryDetail,
      );
      await this.categoryRepository.save(newCategory);
      return res.status(201).json({
        status: 'success',
        category: newCategory,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addCollectionToCategory(
    collectionId: number,
    categoryId: number,
    res: Response,
  ) {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { _id: collectionId },
      });
      const category = await this.categoryRepository.findOne({
        where: { _id: categoryId },
      });

      category.collection = collection;

      await this.categoryRepository.save(category);

      return res.status(200).json({
        status: 'success',
        category,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCategory(
    idCategory: number,
    updateCategoryDetail: UpdateCategoryService,
    res: Response,
  ) {
    try {
      console.log(updateCategoryDetail.collection);
      const collection = await this.collectionRepository.findOne({
        where: { _id: updateCategoryDetail.collection },
      });
      if (!collection) {
        throw new Error('Not found this collection');
      }
      console.log(collection);
      const category = await this.categoryRepository.findOne({
        relations: {
          collection: true,
        },
        where: { _id: idCategory },
      });
      if (!category) {
        throw new Error('Not found this category');
      }
      category.category_name = updateCategoryDetail.category_name;
      category.active = updateCategoryDetail.active;
      category.collection = collection;

      await this.categoryRepository.save(category);
      return res.status(200).json({
        status: 'success',
        category,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: 'Something went wrong in server side !',
      });
    }
  }

  async deleteCategoryService(idCategory: number, res: Response) {
    try {
      const category = await this.categoryRepository.delete({
        _id: idCategory,
      });
      return res.status(204).json({
        status: 'success',
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCats(res: Response) {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['products', 'collection'],
      });
      const maps = categories.map((el) => {
        if (el.collection) {
          return {
            _id: el._id,
            length: el.products.length,
            category_name: el.category_name,
            active: el.active,
            collection: {
              _id: el.collection._id,
              collection_name: el.collection.collection_name,
            },
          };
        } else {
          return {
            _id: el._id,
            length: el.products.length,
            category_name: el.category_name,
            active: el.active,
          };
        }
      });
      return res.status(200).json({
        status: 'success',
        categories: maps,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

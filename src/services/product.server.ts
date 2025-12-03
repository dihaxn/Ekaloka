import { Prisma } from '@prisma/client';

import { validateProductData } from '../lib/validation';
import { prisma } from '../server/db/prisma';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from '../types/errors';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductListResult {
  products: Array<{
    id: string;
    name: string;
    price: number;
    description: string | null;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  static async getProducts(
    filters: ProductFilters = {}
  ): Promise<ProductListResult> {
    try {
      const { page = 1, limit = 10, search } = filters;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      const skip = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = search
        ? {
            OR: [
              {
                name: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                description: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {};

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            createdAt: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof ValidationError) {
        throw error;
      }

      // Handle database errors
      if (
        error instanceof Error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        throw new DatabaseError('Failed to fetch products from database');
      }

      // Re-throw other errors
      throw error;
    }
  }

  static async getProductById(id: string) {
    try {
      if (!id) {
        throw new ValidationError('Product ID is required');
      }

      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          createdAt: true,
        },
      });

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      return product;
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      // Handle database errors
      if (
        error instanceof Error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        throw new DatabaseError('Failed to fetch product from database');
      }

      // Re-throw other errors
      throw error;
    }
  }

  static async createProduct(data: {
    name: string;
    price: number;
    description?: string;
    category: string;
  }) {
    try {
      // Validate product data
      const validation = validateProductData(data);
      if (!validation.isValid) {
        throw validation.errors[0];
      }

      const product = await prisma.product.create({
        data: {
          ...data,
          category: data.category,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          createdAt: true,
        },
      });

      return product;
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof ValidationError) {
        throw error;
      }

      // Handle database errors
      if (
        error instanceof Error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        const prismaError = error as any;
        if (prismaError.code === 'P2002') {
          throw new ConflictError('Product with this name already exists');
        }
        throw new DatabaseError('Failed to create product in database');
      }

      // Re-throw other errors
      throw error;
    }
  }

  static async updateProduct(
    id: string,
    data: {
      name?: string;
      price?: number;
      description?: string;
    }
  ) {
    try {
      if (!id) {
        throw new ValidationError('Product ID is required');
      }

      // Validate update data if provided
      if (data.name || data.price || data.description) {
        const updateData = {
          name: data.name || '',
          price: data.price || 0,
          description: data.description || '',
        };
        const validation = validateProductData(updateData);
        if (!validation.isValid) {
          throw validation.errors[0];
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          createdAt: true,
        },
      });

      return product;
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof ValidationError) {
        throw error;
      }

      // Handle database errors
      if (
        error instanceof Error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        const prismaError = error as any;
        if (prismaError.code === 'P2025') {
          throw new NotFoundError('Product not found');
        }
        if (prismaError.code === 'P2002') {
          throw new ConflictError('Product with this name already exists');
        }
        throw new DatabaseError('Failed to update product in database');
      }

      // Re-throw other errors
      throw error;
    }
  }

  static async deleteProduct(id: string) {
    try {
      if (!id) {
        throw new ValidationError('Product ID is required');
      }

      await prisma.product.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof ValidationError) {
        throw error;
      }

      // Handle database errors
      if (
        error instanceof Error &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        const prismaError = error as any;
        if (prismaError.code === 'P2025') {
          throw new NotFoundError('Product not found');
        }
        throw new DatabaseError('Failed to delete product from database');
      }

      // Re-throw other errors
      throw error;
    }
  }
}

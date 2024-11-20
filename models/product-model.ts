// Read-only properties
const PRODUCT_DB_FIELD = {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    available: 'available',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
} as const

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date | null;
    deletedBy: string | null;
}

type ProductPrimaryId = Pick<Product, 'id'>;

type CreateProduct = Pick<Product, 'name' | 'description' | 'price' | 'available' | 'createdBy' | 'updatedBy'>;

type UpdateProduct = Pick<Product, 'name' | 'description' | 'price' | 'available' | 'updatedBy'>;

type SoftDeleteProduct = Pick<Product, 'deletedAt' | 'deletedBy'>;

export {
    PRODUCT_DB_FIELD,
    Product,
    ProductPrimaryId,
    CreateProduct,
    UpdateProduct,
    SoftDeleteProduct
};

export type CreateUserBody = {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    passwordConfirm: string;
};
export type UpdateProfile = {
    name: string;
    gender: string;
    address: string;
    birthday: string;
};
export type LoginService = {
    account: string;
    password: string;
};
export type ResetPasswordService = {
    password: string;
    passwordConfirm: string;
};
export type UpdatePasswordService = {
    passwordCurrent: string;
    password: string;
    passwordConfirm: string;
};
export type CreateCollectionService = {
    collection_name: string;
};
export type UpdateCollectionService = {
    collection_name?: string;
    active?: boolean;
};
export type CreateCategoryService = {
    category_name: string;
};
export type UpdateCategoryService = {
    category_name?: string;
    active?: boolean;
    collection?: number;
};
export type CreateColorService = {
    color_name: string;
    image_color?: string;
};
export type UpdateColorService = {
    color_name?: string;
    image_color?: string;
};
export type CreateSizeService = {
    size_name: string;
};
export type CreateProductService = {
    name: string;
    description?: string;
    tags?: string;
    material: string;
    category: {
        _id: number;
        category_name: string;
        active: boolean;
        collection: {
            _id: number;
            collection_name: string;
            active: boolean;
        };
    };
    prod_variant: {
        color: {
            _id: number;
            color_name: string;
            image_color: string;
        };
        size: {
            _id: number;
            size_name: string;
        };
        price: number;
        sale?: number;
        quantity: number;
    }[];
};
export type UpdateProductService = {
    name?: string;
    description?: string;
    tags?: string;
    product_image?: string;
    image_hover?: string;
    material?: string;
    prod_variant: {
        colorId?: number;
        sizeId?: number;
        price?: number;
        sale?: number;
        quantity?: number;
    }[];
};
export type createBrandService = {
    brand_name: string;
};
export type createColorService = {
    color_name: string;
    image_color: string;
};
export type ColorServiceType = {
    _id: number;
    color_name: string;
    image_color: string;
};
export type createProductVariantService = {
    color: {
        _id: number;
        color_name: string;
        image_color: string;
    };
    size: {
        _id: number;
        size_name: string;
    };
    price: number;
    sale: number;
    quantity: number;
};
export type createCartService = {
    idProd: number;
    quantity: number;
};
export type inforBooking = {
    country: string;
    first_name: string;
    last_name: string;
    address: string;
    apartment?: string;
    city: string;
    postal_code: string;
    phone: string;
    email?: string;
};

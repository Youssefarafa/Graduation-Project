export interface Subcategory {
	_id: string;
	name: string;
	slug: string;
	category: string;
}

export interface Category {
	_id: string;
	name: string;
	slug: string;
	image: string;
}

export interface Brand {
	_id: string;
	name: string;
	slug: string;
	image: string;
}

export interface Products {
	subcategory: Subcategory[];
	_id: string;
	title: string;
	quantity: number;
	imageCover: string;
	category: Category;
	brand: Brand;
	ratingsAverage: number;
	id: string;
}

export interface Product {
	count: number;
	_id: string;
	product: Products;
	price: number;
}

export interface Data {
	_id: string;
	cartOwner: string;
	products: Product[];
	createdAt: string;
	updatedAt: string;
	__v: number;
	totalCartPrice: number;
}

export interface Cart {
	status: string;
	numOfCartItems: number;
	cartId: string;
	data: Data;
}
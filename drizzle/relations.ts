import { relations } from "drizzle-orm/relations";
import { employees, users, orders, categories, subcategories, orderdetails, products, productImages, suppliers } from "./schema";

export const employeesRelations = relations(employees, ({one, many}) => ({
	employees: one(employees, {
		fields: [employees.superiorId],
		references: [employees.id],
		relationName: "employees_superiorId_employees_id"
	}),
	employeess: many(employees, {
		relationName: "employees_superiorId_employees_id"
	}),
	orderss: many(orders),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	users: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	employees: one(employees, {
		fields: [orders.employeeId],
		references: [employees.id]
	}),
	orderdetailss: many(orderdetails),
}));

export const usersRelations = relations(users, ({many}) => ({
	orderss: many(orders),
}));

export const subcategoriesRelations = relations(subcategories, ({one, many}) => ({
	categories: one(categories, {
		fields: [subcategories.categoryId],
		references: [categories.id]
	}),
	productss: many(products),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	subcategoriess: many(subcategories),
	productss: many(products),
}));

export const orderdetailsRelations = relations(orderdetails, ({one}) => ({
	orders: one(orders, {
		fields: [orderdetails.orderId],
		references: [orders.id]
	}),
	products: one(products, {
		fields: [orderdetails.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	orderdetailss: many(orderdetails),
	productImagess: many(productImages),
	categories: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	subcategories: one(subcategories, {
		fields: [products.subcategoryId],
		references: [subcategories.id]
	}),
	suppliers: one(suppliers, {
		fields: [products.supplierId],
		references: [suppliers.id]
	}),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
	products: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	}),
}));

export const suppliersRelations = relations(suppliers, ({many}) => ({
	productss: many(products),
}));
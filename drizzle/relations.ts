import { relations } from "drizzle-orm/relations";
import { employeesInEshop, usersInEshop, ordersInEshop, categoriesInEshop, subcategoriesInEshop, orderdetailsInEshop, productsInEshop, productImagesInEshop, suppliersInEshop } from "./schema";

export const employeesInEshopRelations = relations(employeesInEshop, ({one, many}) => ({
	employeesInEshop: one(employeesInEshop, {
		fields: [employeesInEshop.superiorId],
		references: [employeesInEshop.id],
		relationName: "employeesInEshop_superiorId_employeesInEshop_id"
	}),
	employeesInEshops: many(employeesInEshop, {
		relationName: "employeesInEshop_superiorId_employeesInEshop_id"
	}),
	ordersInEshops: many(ordersInEshop),
}));

export const ordersInEshopRelations = relations(ordersInEshop, ({one, many}) => ({
	usersInEshop: one(usersInEshop, {
		fields: [ordersInEshop.userId],
		references: [usersInEshop.id]
	}),
	employeesInEshop: one(employeesInEshop, {
		fields: [ordersInEshop.employeeId],
		references: [employeesInEshop.id]
	}),
	orderdetailsInEshops: many(orderdetailsInEshop),
}));

export const usersInEshopRelations = relations(usersInEshop, ({many}) => ({
	ordersInEshops: many(ordersInEshop),
}));

export const subcategoriesInEshopRelations = relations(subcategoriesInEshop, ({one, many}) => ({
	categoriesInEshop: one(categoriesInEshop, {
		fields: [subcategoriesInEshop.categoryId],
		references: [categoriesInEshop.id]
	}),
	productsInEshops: many(productsInEshop),
}));

export const categoriesInEshopRelations = relations(categoriesInEshop, ({many}) => ({
	subcategoriesInEshops: many(subcategoriesInEshop),
	productsInEshops: many(productsInEshop),
}));

export const orderdetailsInEshopRelations = relations(orderdetailsInEshop, ({one}) => ({
	ordersInEshop: one(ordersInEshop, {
		fields: [orderdetailsInEshop.orderId],
		references: [ordersInEshop.id]
	}),
	productsInEshop: one(productsInEshop, {
		fields: [orderdetailsInEshop.productId],
		references: [productsInEshop.id]
	}),
}));

export const productsInEshopRelations = relations(productsInEshop, ({one, many}) => ({
	orderdetailsInEshops: many(orderdetailsInEshop),
	productImagesInEshops: many(productImagesInEshop),
	categoriesInEshop: one(categoriesInEshop, {
		fields: [productsInEshop.categoryId],
		references: [categoriesInEshop.id]
	}),
	subcategoriesInEshop: one(subcategoriesInEshop, {
		fields: [productsInEshop.subcategoryId],
		references: [subcategoriesInEshop.id]
	}),
	suppliersInEshop: one(suppliersInEshop, {
		fields: [productsInEshop.supplierId],
		references: [suppliersInEshop.id]
	}),
}));

export const productImagesInEshopRelations = relations(productImagesInEshop, ({one}) => ({
	productsInEshop: one(productsInEshop, {
		fields: [productImagesInEshop.productId],
		references: [productsInEshop.id]
	}),
}));

export const suppliersInEshopRelations = relations(suppliersInEshop, ({many}) => ({
	productsInEshops: many(productsInEshop),
}));
import { relations } from "drizzle-orm/relations";
import { employees, categories, subcategories, customers, orders, products, suppliers, orderDetails, orderProduct} from "./schema";

export const employeesRelations = relations(employees, ({one, many}) => ({
	employee: one(employees, {
		fields: [employees.superiorId],
		references: [employees.id],
		relationName: "employees_superiorId_employees_id"
	}),
	employees: many(employees, {
		relationName: "employees_superiorId_employees_id"
	}),
	orders: many(orders),
}));

export const subcategoriesRelations = relations(subcategories, ({one, many}) => ({
	category: one(categories, {
		fields: [subcategories.categoryId],
		references: [categories.id]
	}),
	products: many(products),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	subcategories: many(subcategories),
	products: many(products),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	customer: one(customers, {
		fields: [orders.customerId],
		references: [customers.id]
	}),
	employee: one(employees, {
		fields: [orders.employeeId],
		references: [employees.id]
	}),
	orderDetails: many(orderDetails),
	orderProducts: many(orderProduct),
}));

export const customersRelations = relations(customers, ({many}) => ({
	orders: many(orders),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	subcategory: one(subcategories, {
		fields: [products.subcategoryId],
		references: [subcategories.id]
	}),
	supplier: one(suppliers, {
		fields: [products.supplierId],
		references: [suppliers.id]
	}),
	orderDetails: many(orderDetails),
	orderProducts: many(orderProduct),
}));

export const suppliersRelations = relations(suppliers, ({many}) => ({
	products: many(products),
}));

export const orderDetailsRelations = relations(orderDetails, ({one}) => ({
	order: one(orders, {
		fields: [orderDetails.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderDetails.productId],
		references: [products.id]
	}),
}));

export const orderProductRelations = relations(orderProduct, ({one}) => ({
	order: one(orders, {
		fields: [orderProduct.ordersId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderProduct.productsId],
		references: [products.id]
	}),
}));

//export const aspNetUserRolesRelations = relations(aspNetUserRoles, ({one}) => ({
	// 	aspNetRole: one(aspNetRoles, {
	// 		fields: [aspNetUserRoles.roleId],
	// 		references: [aspNetRoles.id]
	// 	}),
	// 	aspNetUser: one(aspNetUsers, {
	// 		fields: [aspNetUserRoles.userId],
	// 		references: [aspNetUsers.id]
	// 	}),
	// }));

// export const aspNetUserLoginsRelations = relations(aspNetUserLogins, ({one}) => ({
// 	aspNetUser: one(aspNetUsers, {
// 		fields: [aspNetUserLogins.userId],
// 		references: [aspNetUsers.id]
// 	}),
// }));

// export const aspNetUserTokensRelations = relations(aspNetUserTokens, ({one}) => ({
// 	aspNetUser: one(aspNetUsers, {
// 		fields: [aspNetUserTokens.userId],
// 		references: [aspNetUsers.id]
// 	}),
// }));

// export const aspNetRoleClaimsRelations = relations(aspNetRoleClaims, ({one}) => ({
// 	aspNetRole: one(aspNetRoles, {
// 		fields: [aspNetRoleClaims.roleId],
// 		references: [aspNetRoles.id]
// 	}),
// }));

// export const aspNetRolesRelations = relations(aspNetRoles, ({many}) => ({
// 	aspNetRoleClaims: many(aspNetRoleClaims),
// 	aspNetUserRoles: many(aspNetUserRoles),
// }));

// export const aspNetUserClaimsRelations = relations(aspNetUserClaims, ({one}) => ({
// 	aspNetUser: one(aspNetUsers, {
// 		fields: [aspNetUserClaims.userId],
// 		references: [aspNetUsers.id]
// 	}),
// }));

// export const aspNetUsersRelations = relations(aspNetUsers, ({many}) => ({
// 	aspNetUserClaims: many(aspNetUserClaims),
// 	aspNetUserRoles: many(aspNetUserRoles),
// 	aspNetUserLogins: many(aspNetUserLogins),
// 	aspNetUserTokens: many(aspNetUserTokens),
// }));
import { pgTable, varchar, index, foreignKey, integer, date, timestamp, text, uniqueIndex, boolean, numeric, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



// export const efMigrationsHistory = pgTable("__EFMigrationsHistory", {
// 	migrationId: varchar("MigrationId", { length: 150 }).primaryKey().notNull(),
// 	productVersion: varchar("ProductVersion", { length: 32 }).notNull(),
// });

export const employees = pgTable("Employees", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Employees_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	title: varchar("Title", { length: 50 }).notNull(),
	birthDate: date("BirthDate"),
	hireDate: date("HireDate"),
	address: varchar("Address", { length: 50 }).notNull(),
	city: varchar("City", { length: 30 }).notNull(),
	superiorId: integer("SuperiorId"),
	// TODO: failed to parse database type 'bytea'
	// photo: unknown("Photo"),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
}, (table) => [
	index("IX_Employees_SuperiorId").using("btree", table.superiorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.superiorId],
			foreignColumns: [table.id],
			name: "FK_Employees_Employees_SuperiorId"
		}),
]);

export const shippers = pgTable("Shippers", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Shippers_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	phone: varchar("Phone", { length: 30 }).notNull(),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
});


export const categories = pgTable("Categories", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Categories_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
});

export const subcategories = pgTable("Subcategories", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Subcategories_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	categoryId: integer("CategoryId").notNull(),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
}, (table) => [
	index("IX_Subcategories_CategoryId").using("btree", table.categoryId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "FK_Subcategories_Categories_CategoryId"
		}).onDelete("cascade"),
]);

export const customers = pgTable("Customers", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Customers_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	address: varchar("Address", { length: 100 }),
	city: varchar("City", { length: 50 }),
	postalCode: integer("PostalCode"),
	phone: varchar("Phone", { length: 20 }),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
});

export const orders = pgTable("Orders", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Orders_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	customerId: integer("CustomerId").notNull(),
	employeeId: integer("EmployeeId"),
	totalPrice: numeric("TotalPrice"),
	orderDate: timestamp("OrderDate", { withTimezone: true, mode: 'string' }).notNull(),
	shippedDate: timestamp("ShippedDate", { withTimezone: true, mode: 'string' }),
	shipVia: integer("ShipVia"),
	shipName: varchar("ShipName", { length: 50 }).notNull(),
	shipAddress: varchar("ShipAddress", { length: 50 }).notNull(),
	shipCity: varchar("ShipCity", { length: 50 }).notNull(),
	shipPostalCode: integer("ShipPostalCode"),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
}, (table) => [
	index("IX_Orders_CustomerId").using("btree", table.customerId.asc().nullsLast().op("int4_ops")),
	index("IX_Orders_EmployeeId").using("btree", table.employeeId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "FK_Orders_Customers_CustomerId"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "FK_Orders_Employees_EmployeeId"
		}),
]);

export const products = pgTable("Products", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Products_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	description: varchar("Description", { length: 200 }),
	price: numeric("Price"),
	amount: integer("Amount"),
	sold: integer("Sold"),
	isDeleted: boolean("IsDeleted"),
	categoryId: integer("CategoryId").notNull(),
	subcategoryId: integer("SubcategoryId").notNull(),
	supplierId: integer("SupplierId"),
	imageUrl: varchar("ImageUrl", { length: 100 }),
	// TODO: failed to parse database type 'bytea'
	// image: unknown("Image"),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
}, (table) => [
	index("IX_Products_CategoryId").using("btree", table.categoryId.asc().nullsLast().op("int4_ops")),
	index("IX_Products_SubcategoryId").using("btree", table.subcategoryId.asc().nullsLast().op("int4_ops")),
	index("IX_Products_SupplierId").using("btree", table.supplierId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "FK_Products_Categories_CategoryId"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.subcategoryId],
			foreignColumns: [subcategories.id],
			name: "FK_Products_Subcategories_SubcategoryId"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "FK_Products_Suppliers_SupplierId"
		}),
]);

export const suppliers = pgTable("Suppliers", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "Suppliers_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	contact: varchar("Contact", { length: 50 }).notNull(),
	address: varchar("Address", { length: 50 }),
	city: varchar("City", { length: 50 }),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
});

export const orderDetails = pgTable("OrderDetails", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "OrderDetails_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	orderId: integer("OrderId").notNull(),
	productId: integer("ProductId").notNull(),
	unitPrice: numeric("UnitPrice").notNull(),
	quantity: integer("Quantity").notNull(),
	timeOfOrder: timestamp("TimeOfOrder", { withTimezone: true, mode: 'string' }).notNull(),
	discount: numeric("Discount"),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }).notNull(),
	lastModifiedBy: text("LastModifiedBy"),
}, (table) => [
	index("IX_OrderDetails_OrderId").using("btree", table.orderId.asc().nullsLast().op("int4_ops")),
	index("IX_OrderDetails_ProductId").using("btree", table.productId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "FK_OrderDetails_Orders_OrderId"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "FK_OrderDetails_Products_ProductId"
		}).onDelete("cascade"),
]);



export const orderProduct = pgTable("OrderProduct", {
	ordersId: integer("OrdersId").notNull(),
	productsId: integer("ProductsId").notNull(),
}, (table) => [
	index("IX_OrderProduct_ProductsId").using("btree", table.productsId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.ordersId],
			foreignColumns: [orders.id],
			name: "FK_OrderProduct_Orders_OrdersId"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productsId],
			foreignColumns: [products.id],
			name: "FK_OrderProduct_Products_ProductsId"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.ordersId, table.productsId], name: "PK_OrderProduct"}),
]);

// export const aspNetUserRoles = pgTable("AspNetUserRoles", {
// 	userId: text("UserId").notNull(),
// 	roleId: text("RoleId").notNull(),
// }, (table) => [
// 	index("IX_AspNetUserRoles_RoleId").using("btree", table.roleId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 			columns: [table.roleId],
// 			foreignColumns: [aspNetRoles.id],
// 			name: "FK_AspNetUserRoles_AspNetRoles_RoleId"
// 		}).onDelete("cascade"),
// 	foreignKey({
// 			columns: [table.userId],
// 			foreignColumns: [aspNetUsers.id],
// 			name: "FK_AspNetUserRoles_AspNetUsers_UserId"
// 		}).onDelete("cascade"),
// 	primaryKey({ columns: [table.userId, table.roleId], name: "PK_AspNetUserRoles"}),
// ]);

// export const aspNetRoles = pgTable("AspNetRoles", {
// 	id: text("Id").primaryKey().notNull(),
// 	name: varchar("Name", { length: 256 }),
// 	normalizedName: varchar("NormalizedName", { length: 256 }),
// 	concurrencyStamp: text("ConcurrencyStamp"),
// }, (table) => [
// 	uniqueIndex("RoleNameIndex").using("btree", table.normalizedName.asc().nullsLast().op("text_ops")),
// ]);

// export const aspNetRoleClaims = pgTable("AspNetRoleClaims", {
// 	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "AspNetRoleClaims_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
// 	roleId: text("RoleId").notNull(),
// 	claimType: text("ClaimType"),
// 	claimValue: text("ClaimValue"),
// }, (table) => [
// 	index("IX_AspNetRoleClaims_RoleId").using("btree", table.roleId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 			columns: [table.roleId],
// 			foreignColumns: [aspNetRoles.id],
// 			name: "FK_AspNetRoleClaims_AspNetRoles_RoleId"
// 		}).onDelete("cascade"),
// ]);

// export const aspNetUsers = pgTable("AspNetUsers", {
// 	id: text("Id").primaryKey().notNull(),
// 	fullName: varchar("FullName", { length: 70 }).notNull(),
// 	userName: varchar("UserName", { length: 256 }),
// 	normalizedUserName: varchar("NormalizedUserName", { length: 256 }),
// 	email: varchar("Email", { length: 256 }),
// 	normalizedEmail: varchar("NormalizedEmail", { length: 256 }),
// 	emailConfirmed: boolean("EmailConfirmed").notNull(),
// 	passwordHash: text("PasswordHash"),
// 	securityStamp: text("SecurityStamp"),
// 	concurrencyStamp: text("ConcurrencyStamp"),
// 	phoneNumber: text("PhoneNumber"),
// 	phoneNumberConfirmed: boolean("PhoneNumberConfirmed").notNull(),
// 	twoFactorEnabled: boolean("TwoFactorEnabled").notNull(),
// 	lockoutEnd: timestamp("LockoutEnd", { withTimezone: true, mode: 'string' }),
// 	lockoutEnabled: boolean("LockoutEnabled").notNull(),
// 	accessFailedCount: integer("AccessFailedCount").notNull(),
// }, (table) => [
// 	index("EmailIndex").using("btree", table.normalizedEmail.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("UserNameIndex").using("btree", table.normalizedUserName.asc().nullsLast().op("text_ops")),
// ]);

// export const aspNetUserClaims = pgTable("AspNetUserClaims", {
// 	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: "AspNetUserClaims_Id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
// 	userId: text("UserId").notNull(),
// 	claimType: text("ClaimType"),
// 	claimValue: text("ClaimValue"),
// }, (table) => [
// 	index("IX_AspNetUserClaims_UserId").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 			columns: [table.userId],
// 			foreignColumns: [aspNetUsers.id],
// 			name: "FK_AspNetUserClaims_AspNetUsers_UserId"
// 		}).onDelete("cascade"),
// ]);


// export const aspNetUserLogins = pgTable("AspNetUserLogins", {
// 	loginProvider: text("LoginProvider").notNull(),
// 	providerKey: text("ProviderKey").notNull(),
// 	providerDisplayName: text("ProviderDisplayName"),
// 	userId: text("UserId").notNull(),
// }, (table) => [
// 	index("IX_AspNetUserLogins_UserId").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 			columns: [table.userId],
// 			foreignColumns: [aspNetUsers.id],
// 			name: "FK_AspNetUserLogins_AspNetUsers_UserId"
// 		}).onDelete("cascade"),
// 	primaryKey({ columns: [table.loginProvider, table.providerKey], name: "PK_AspNetUserLogins"}),
// ]);

// export const aspNetUserTokens = pgTable("AspNetUserTokens", {
// 	userId: text("UserId").notNull(),
// 	loginProvider: text("LoginProvider").notNull(),
// 	name: text("Name").notNull(),
// 	value: text("Value"),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.userId],
// 			foreignColumns: [aspNetUsers.id],
// 			name: "FK_AspNetUserTokens_AspNetUsers_UserId"
// 		}).onDelete("cascade"),
// 	primaryKey({ columns: [table.userId, table.loginProvider, table.name], name: "PK_AspNetUserTokens"}),
// ]);

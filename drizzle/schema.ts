import { pgTable, pgSchema, index, foreignKey, integer, varchar, date, timestamp, text, numeric, serial, boolean, customType, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

//export const eshop = pgSchema("eshop");

const bytea = customType<{
  data: Buffer;
  driverData: Buffer;
  config: { fieldName: string };
}>({
  dataType() {
    return "bytea";
  },
});

export const subcategoriesIdSeq = pgSequence("subcategories_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const employeesIdSeq = pgSequence("employees_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const ordersIdSeq = pgSequence("orders_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const suppliersIdSeq = pgSequence("suppliers_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const usersIdSeq = pgSequence("users_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const productsIdSeq = pgSequence("products_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const categoriesIdSeq = pgSequence("categories_Id_seq", {  startWith: "1", increment: "1", minValue: "0", maxValue: "2147483647", cache: "1", cycle: false })
export const orderdetailsIdSeq = pgSequence("orderdetails_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const productImagesIdSeq = pgSequence("product_images_Id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const employees = pgTable("employees", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: 'employees_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	title: varchar("Title", { length: 50 }).notNull(),
	birthDate: date("BirthDate"),
	hireDate: date("HireDate"),
	address: varchar("Address", { length: 50 }).notNull(),
	city: varchar("City", { length: 30 }).notNull(),
	superiorId: integer("SuperiorId"),
	created: timestamp("Created", { mode: 'string' }).defaultNow(),
	createdBy: text("CreatedBy"),
	lastModifiedBy: text("LastModifiedBy"),
}, (table) => [
	index("IX_Employees_SuperiorId").using("btree", table.superiorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.superiorId],
			foreignColumns: [table.id],
			name: "FK_Employees_Employees_SuperiorId"
		}),
]);

export const categories = pgTable("categories", {
	id: integer("Id").primaryKey().generatedAlwaysAsIdentity({ name: 'categories_Id_seq', startWith: 1, increment: 1, minValue: 0, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	created: timestamp("Created", { mode: 'string' }).defaultNow(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }),
	lastModifiedBy: text("LastModifiedBy"),
	imageUrl: varchar("ImageUrl", { length: 200 }),
});

export const orders = pgTable("orders", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: 'orders_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	userId: integer("UserId").notNull(),
	employeeId: integer("EmployeeId"),
	totalPrice: numeric("TotalPrice"),
	shippedDate: timestamp("ShippedDate", { withTimezone: true, mode: 'string' }),
	shipperId: integer("ShipperId"),
	shipCity: varchar("ShipCity", { length: 50 }).notNull(),
	shipPostalCode: integer("ShipPostalCode"),
	created: timestamp("Created", { mode: 'string' }).defaultNow(),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }),
	shipAddress: varchar("ShipAddress", { length: 50 }),
}, (table) => [
	index("IX_Orders_EmployeeId").using("btree", table.employeeId.asc().nullsLast().op("int4_ops")),
	index("IX_Orders_UserId").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "FK_Orders_Users_UserId"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employees.id],
			name: "FK_Orders_Employees_EmployeeId"
		}),
]);

export const users = pgTable("users", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: 'users_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	address: varchar("Address", { length: 100 }),
	city: varchar("City", { length: 50 }),
	postalCode: integer("PostalCode"),
	phone: varchar("Phone", { length: 20 }),
	created: timestamp("Created", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	username: varchar("Username", { length: 50 }),
	email: varchar("Email", { length: 50 }).notNull(),
	passwordHash: bytea({fieldName: "PasswordHash"}).notNull(),
	passwordSalt: bytea({fieldName: "PasswordSalt"}).notNull(),
	role: varchar(),
});

export const subcategories = pgTable("subcategories", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: '"subcategories_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	categoryId: integer("CategoryId").notNull(),
	created: timestamp("Created", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: text("LastModifiedBy"),
	imageUrl: varchar("ImageUrl"),
}, (table) => [
	index("IX_Subcategories_CategoryId").using("btree", table.categoryId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "FK_Subcategories_Categories_CategoryId"
		}).onDelete("cascade"),
]);

export const suppliers = pgTable("suppliers", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: 'suppliers_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	contact: varchar("Contact", { length: 50 }).notNull(),
	address: varchar("Address", { length: 50 }),
	city: varchar("City", { length: 50 }),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const orderdetails = pgTable("orderdetails", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: 'orderdetails_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	orderId: integer("OrderId").notNull(),
	productId: integer("ProductId").notNull(),
	price: numeric("Price"),
	quantity: integer("Quantity").notNull(),
	created: timestamp("Created", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
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

export const productImages = pgTable("product_images", {
	id: serial("Id").primaryKey().notNull(),
	productId: integer("ProductId").notNull(),
	imageUrl: varchar("ImageUrl", { length: 200 }).notNull(),
	isMain: boolean("IsMain").default(false),
	orderIndex: integer("OrderIndex"),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "FK_ProductImages_Products_ProductId"
		}).onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: integer("Id").primaryKey().generatedByDefaultAsIdentity({ name: 'products_Id_seq', startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: varchar("Name", { length: 50 }).notNull(),
	description: varchar("Description", { length: 200 }),
	price: numeric("Price"),
	amount: integer("Amount"),
	sold: integer("Sold"),
	isDeleted: boolean("IsDeleted").default(false),
	categoryId: integer("CategoryId").notNull(),
	subcategoryId: integer("SubcategoryId").notNull(),
	supplierId: integer("SupplierId"),
	created: timestamp("Created", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: text("CreatedBy"),
	lastModified: timestamp("LastModified", { withTimezone: true, mode: 'string' }),
	lastModifiedBy: text("LastModifiedBy"),
	discount: numeric("Discount"),
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

export const shippers = pgTable("shippers", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "shippers_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	email: varchar({ length: 50 }),
	phone: varchar(),
});

import { Request, Response } from "express"
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { products } from "../../../drizzle/schema";
import { z } from "zod";
import { handleValidationError } from "@/utils/zodHelper";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be a positive number"),
    discount: z.number().positive("discount must be positive integer").default(0).optional(),
    description: z.string().optional(),
    categoryId: z.number().int().positive("Category ID must be a positive integer"),
    subcategoryId: z.number().int().positive("Subcategory ID must be a positive integer"),
});

export function listProducts(req: Request, res: Response) {
    res.send('Products')
}


export async function getProductById(req: Request, res: Response) {
    const productId = req.params.id;
    if (!productId) {
        res.status(400).send('Product ID is required');
    }

    try {
        const [result] = await db.select().from(products).where(eq(products.id, Number(productId)));
        if (!result) {
            res.status(404).send('Product not found');
        }
        res.json(result);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send('Internal Server Error');
    }
}

export async function createProduct(req: Request, res: Response) {

    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
        return handleValidationError(res, validation.error);
    }
    const { name, price, description, discount, categoryId, subcategoryId } = req.body;

    if (!name || !price || !categoryId || !subcategoryId) {
        return res.status(400).send('Name, price, categoryId, and subcategoryId are required');
    }

    try {
        const [newProduct] = await db.insert(products).values({
            name,
            price,
            description,
            categoryId,
            subcategoryId
        }).returning();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send('Internal Server Error');
    }
}

export function updateProduct(req: Request, res: Response) {
    res.send('Update Product')
}

export function deleteProduct(req: Request, res: Response) {    
    res.send('Delete Product')
}
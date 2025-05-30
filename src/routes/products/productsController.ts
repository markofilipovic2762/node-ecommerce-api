import { Request, Response } from "express";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { productImagesInEshop, productsInEshop } from "../../../drizzle/schema";
import { z } from "zod";
import { handleValidationError } from "@/utils/zodHelper";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string(),
  discount: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().int().positive("Amount must be a positive integer").optional(),
  categoryId: z
    .number()
    .int()
    .positive("Category ID must be a positive integer"),
  subcategoryId: z
    .number()
    .int()
    .positive("Subcategory ID must be a positive integer"),
  imageUrls: z.array(z.string()).optional(),
});

export function listProducts(req: Request, res: Response) {
  res.send("Products");
}

export async function getProductById(req: Request, res: Response) {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).send("Product ID is required");
  }

  try {
    const [result] = await db
      .select()
      .from(productsInEshop)
      .where(eq(productsInEshop.id, Number(productId)));
    if (!result) {
      res.status(404).send("Product not found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function createProduct(req: Request, res: Response) {
  const validation = productSchema.safeParse(req.body);
  if (!validation.success) handleValidationError(res, validation.error);
  
  const { name, price, description, discount, categoryId, subcategoryId, imageUrls } =
    req.body;

  if (!name || !price || !categoryId || !subcategoryId) {
    res
      .status(400)
      .send("Name, price, categoryId, and subcategoryId are required");
  }

  try {
    const [newProduct] = await db
      .insert(productsInEshop)
      .values({
        name,
        price,
        description,
        categoryId,
        subcategoryId,
        discount,
      })
      .returning();
    if (imageUrls && imageUrls.length > 0) {
        await db
            .insert(productImagesInEshop)
            .values(
            imageUrls.map((url: any) => ({
                productId: newProduct.id,
                imageUrl: url,
            }))
            );
        }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function updateProduct(req: Request, res: Response) {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).send("Product ID is required");
  }

  const validation = productSchema.partial().safeParse(req.body);
  if (!validation.success) handleValidationError(res, validation.error);

  try {
    const [existingProduct] = await db
      .select()
      .from(productsInEshop)
      .where(eq(productsInEshop.id, Number(productId)));
    if (!existingProduct) {
      res.status(404).send("Product not found");
    }

    const updateData = validation.data;
    if(!!updateData) {
      const [updatedProduct] = await db
        .update(productsInEshop)
        .set({
          name: updateData.name,
        })
        .where(eq(productsInEshop.id, Number(productId)))
        .returning();

      res.json(updatedProduct);
    }
    res.status(400).send("No valid data provided for update");
    
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
}

export function deleteProduct(req: Request, res: Response) {
  res.send("Delete Product");
}

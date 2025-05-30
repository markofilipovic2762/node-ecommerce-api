import { Request, RequestHandler, Response } from "express";
import { db } from "@/db";
import { categoriesInEshop } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { handleValidationError } from "@/utils/zodHelper";

// Zod schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  imageUrl: z.string().url().optional(),
});

// List all categories
export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await db.select().from(categoriesInEshop);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get category by ID
export async function getCategoryById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).send("Category ID is required");
  try {
    const [category] = await db
      .select()
      .from(categoriesInEshop)
      .where(eq(categoriesInEshop.id, id));
    if (!category) res.status(404).send("Category not found");
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create a new category
export async function createCategory(req: Request, res: Response) {
  const validation = categorySchema.safeParse(req.body);
  if (!validation.data) {
    res.status(400).send("Invalid category data");
  }
  if (!validation.success) handleValidationError(res, validation.error);
  
  if(validation.data) {
    const { name, imageUrl } = validation.data;
    try {
      const [newCategory] = await db
        .insert(categoriesInEshop)
        .values({ name, imageUrl })
        .returning();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).send("Internal Server Error");
    }
  }  
  
}

// Update a category
export async function updateCategory(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).send("Category ID is required");

  const validation = categorySchema.safeParse(req.body);

  // This check should come first and return immediately if validation fails
  if (!validation.success) {
    return handleValidationError(res, validation.error);
  }

  // No need to check validation.data again since we already checked validation.success
  try {
    const [existing] = await db
      .select()
      .from(categoriesInEshop)
      .where(eq(categoriesInEshop.id, id));

    if (!existing) return res.status(404).send("Category not found");

    const [updated] = await db
      .update(categoriesInEshop)
      .set(validation.data) // validation.data is safe to use here
      .where(eq(categoriesInEshop.id, id))
      .returning();

    return res.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).send("Internal Server Error");
  }
}

// Delete a category
export async function deleteCategory(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).send("Category ID is required");
  try {
    const [deleted] = await db
      .delete(categoriesInEshop)
      .where(eq(categoriesInEshop.id, id))
      .returning();
    if (!deleted) return res.status(404).send("Category not found");
    return res.status(200).send("Category deleted");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
}

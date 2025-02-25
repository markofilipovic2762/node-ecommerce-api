import { Request, Response } from "express"

export function listProducts(req: Request, res: Response) {
    res.send('Products')
}

export function getProductById(req: Request, res: Response) {
    res.send(`Product ${req.params.id}`)
}

export function createProduct(req: Request, res: Response) {
    res.send('Create Product')
}

export function updateProduct(req: Request, res: Response) {
    res.send('Update Product')
}

export function deleteProduct(req: Request, res: Response) {    
    res.send('Delete Product')
}
import { RequestHandler, Router } from 'express'
import { createCategory, deleteCategory, getCategoryById, listCategories, updateCategory } from './categoriesController'
const router = Router()

router.get('/', listCategories)

router.get('/:id', getCategoryById as RequestHandler)
router.post('/', createCategory)
router.put('/:id', updateCategory as RequestHandler)
router.delete('/:id', deleteCategory as RequestHandler)

export default router
import { Router } from 'express'
import { login, register} from './authController'
const router = Router()

router.get('/login', login)

router.get('/register', register)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
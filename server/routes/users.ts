import { Router } from 'express'

import userController from '../controllers/userController'

const router = Router()

router.post('/', userController.create)
router.get('/', userController.getAll)

export default router

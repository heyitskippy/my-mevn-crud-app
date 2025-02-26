import type { Request } from 'express'
import { Router } from 'express'

import userController from '~/controllers/userController'

const router = Router()

router.get('/', userController.getAll)

router.post('/', (req: Request, ...args) =>
  !Array.isArray(req.body)
    ? userController.create(req, ...args)
    : userController.createMany(req, ...args),
)

router.get('/:id', userController.getById)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)

router.delete('/', userController.deleteAll)

export default router

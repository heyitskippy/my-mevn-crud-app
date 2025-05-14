import type { Request } from 'express'
import { Router } from 'express'

import { body } from 'express-validator'

import userController from '~/controllers/userController'

const router = Router()

router.get('/', userController.getAll)

router.post('/', body('**').escape().trim(), (req: Request, ...args) =>
  !Array.isArray(req.body)
    ? userController.create(req, ...args)
    : userController.createMany(req, ...args),
)

router.get('/me', userController.getById)

router.get('/:id', userController.getById)
router.put('/:id', body('**').escape().trim(), userController.update)
router.delete('/:id', userController.delete)

router.delete('/', userController.deleteAll)

export default router

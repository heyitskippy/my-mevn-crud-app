import { Router } from 'express'

import { body } from 'express-validator'

import userController from '~/controllers/userController'
import authController from '~/controllers/authController'

const router = Router()

router.post('/login', body('**').escape().trim(), authController.login)
router.post('/register', body('**').escape().trim(), userController.create, authController.login)
router.post('/refresh', authController.refresh)

export default router

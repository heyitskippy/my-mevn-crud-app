import { Router } from 'express'

const router = Router()

router.get('*', function (_, res) {
  res.status(404).json({ errors: { server: '404: not found' } })
})

export default router

import { Router } from 'express'

const router = Router()

router.get('*', function (_req, res, next) {
  if (res.headersSent) return next()

  res.status(404).json({ errors: { server: '404: not found' } })
})

export default router

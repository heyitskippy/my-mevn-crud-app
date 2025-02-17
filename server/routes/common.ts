import { Router } from 'express'

const router = Router()

router.get(`/api`, (_, res) => {
  res.send("It's API!")
})

export default router

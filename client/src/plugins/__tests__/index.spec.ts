/* eslint-disable  @typescript-eslint/no-explicit-any */
import { it, expect, vi } from 'vitest'

import { registerPlugins } from '../index'

it('registerPlugins calls app.use with plugins', () => {
  const app = { use: vi.fn().mockReturnThis() }

  registerPlugins(app as any)
  expect(app.use).toHaveBeenCalledTimes(3)
})

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { startProdServer } from '../prodServerConfig'

const { VITE_SERVER_PORT: PORT, VITE_ROUTES_API: API } = import.meta.env

const staticHandler = vi.fn((_req, _res, next) => next())

vi.mock('express', () => ({
  default: {
    static: vi.fn(() => staticHandler),
  },
}))

describe('prodServerConfig', () => {
  let app: any
  let mockNext: any
  let mockReq: any
  let mockRes: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockNext = vi.fn()
    mockReq = { path: '/' }
    mockRes = { sendFile: vi.fn() }

    app = {
      use: vi.fn((middleware) => middleware(mockReq, mockRes, mockNext)),
      get: vi.fn((_path, handler) => handler(mockReq, mockRes, mockNext)),
      listen: vi.fn().mockReturnValue({ close: vi.fn() }),
      emit: vi.fn(),
    }
  })

  it('should setup static files and SPA routes', () => {
    startProdServer(app)

    expect(app.use).toHaveBeenCalled()
    expect(app.get).toHaveBeenCalledWith('*', expect.any(Function))
  })

  it('should handle API routes in static middleware', () => {
    mockReq.path = `${API}/test`

    startProdServer(app)

    expect(mockNext).toHaveBeenCalled()
    expect(staticHandler).not.toHaveBeenCalled()
  })

  it('should handle non-API routes in static middleware', () => {
    mockReq.path = '/static/file.js'

    startProdServer(app)

    expect(staticHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext)
  })

  it('should handle SPA fallback for non-API routes', () => {
    mockReq.path = '/some/client/route'

    startProdServer(app)

    expect(mockRes.sendFile).toHaveBeenCalled()
  })

  it('should pass through API routes in wildcard handler', () => {
    mockReq.path = `${API}/test`

    app.get = vi.fn((_path, handler) => {
      handler(mockReq, mockRes, mockNext)
    })

    startProdServer(app)

    expect(mockNext).toHaveBeenCalled()
    expect(mockRes.sendFile).not.toHaveBeenCalled()
  })

  it('should emit started event when server starts', () => {
    const server = startProdServer(app)
    const callback = app.listen.mock.calls[0][1]

    callback()

    expect(app.emit).toHaveBeenCalledWith('started')
    expect(app.listen).toHaveBeenCalledWith(PORT, expect.any(Function))
    server.close()
  })
})

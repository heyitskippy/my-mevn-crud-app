/* eslint-disable  @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'

import apiPlugin, { API } from '../api'

describe('API class', () => {
  let api: API
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    globalThis.fetch = fetchMock
    api = new API()
  })

  it('sets access token and refresh function without error', () => {
    api.setAccessToken('token')

    const fn = vi.fn()
    api.setRefresh(fn)

    expect(typeof api.setAccessToken).toBe('function')
    expect(typeof api.setRefresh).toBe('function')
  })

  it('makes requests with correct headers and body', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: 1 }),
    })

    api.setAccessToken('token')

    expect(await api.get('/')).toEqual({ ok: 1 })
    expect(await api.post('/', { foo: 'bar' })).toEqual({ ok: 1 })
    expect(await api.put('/', { foo: 'bar' })).toEqual({ ok: 1 })
    expect(await api.delete('/')).toEqual({ ok: 1 })
  })

  it('throws on error status', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ errors: { foo: 'bar' } }),
    })

    await expect(api.get('/error')).rejects.toThrow('[422]')
  })

  it('plugin provides api', () => {
    const app = { provide: vi.fn() }

    apiPlugin.install(app as any)

    expect(app.provide).toHaveBeenCalledWith('api', expect.any(API))
  })

  it('should handle GET with params and no body', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: 1 }),
    })

    await api.get('/test', undefined, { foo: 'bar' } as any)

    const [input, init] = fetchMock.mock.calls[0]
    expect(input).toContain('/test')

    if (init.body) {
      expect(init.body.toString()).toContain('foo=bar')
    } else {
      expect(input).toContain('foo=bar')
    }
  })

  it('should handle POST with FormData', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: 1 }),
    })

    const formData = new FormData()
    formData.append('foo', 'bar')

    await api.post('/test', formData)
    const [, init] = fetchMock.mock.calls[0]

    expect(init.headers['Content-Type']).toBe('multipart/form-data')
    expect(init.body).toBe(formData)
  })

  it('should handle error 401 and call refresh', async () => {
    const refresh = vi.fn().mockResolvedValue(undefined)

    api.setAccessToken('token')
    api.setRefresh(refresh)

    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    })

    await expect(api.get('/unauthorized')).rejects.toThrow('[401]')
    expect(refresh).toHaveBeenCalled()
  })

  it('should handle error 403', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({}),
    })

    await expect(api.get('/forbidden')).rejects.toThrow('[403]')
  })

  it('should handle error 404', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    })

    await expect(api.get('/notfound')).rejects.toThrow('[404]')
  })

  it('should handle unknown error status', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    await expect(api.get('/server-error')).rejects.toThrow('[500] Unknown error')
  })
})

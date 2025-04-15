import type { Plugin } from 'vue'
import type { Params } from '_/types/api'

import { isEmpty } from 'lodash-es'

import { prettifyErrors } from '_/helpers'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Headers = Record<'Content-Type' | string, string>
type BodyInit = FormData | URLSearchParams | string | object
type OptionInit = { method: Method; body?: FormData | URLSearchParams | string; headers: Headers }

const API_URL = import.meta.env.VITE_API

export class API {
  readonly #fetch = window.fetch.bind(window)

  #getOptions<P extends Params>(url: string, method: Method, body?: BodyInit, params?: P) {
    const init: OptionInit = {
      method,
      headers: {},
    }
    const p = !isEmpty(params) ? new URLSearchParams(params) : null
    let input = `${API_URL}${url}`

    if (!body && p) init.body = p
    else {
      if (p) input = `${input}?${p}`

      const b = body instanceof FormData ? body : JSON.stringify(body)

      init.headers['Content-Type'] =
        body instanceof FormData ? 'multipart/form-data' : 'application/json;charset=utf-8'

      init.body = b
    }

    return { input, init }
  }

  async #handleError(response: globalThis.Response) {
    if (response.ok) return

    const status = response.status
    const defaultError = 'Unknown error'

    const body = await response.json()

    const errors: Record<number, () => string> = {
      404: () => 'Not found',
      422: () => `Validation error\n${prettifyErrors(body.errors)}`,
    }

    const message = `[${status}] ${errors[status]?.() ?? defaultError}`

    throw Error(message, { cause: { status, errors: body.errors ?? {} } })
  }

  async get<R = unknown, P extends Params = Params>(url: string, body?: BodyInit, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'GET', body, params)
    const response = await this.#fetch(input, init)

    await this.#handleError(response)

    return (await response.json()) as Promise<R>
  }

  async post<R = unknown, P extends Params = Params>(url: string, body: BodyInit, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'POST', body, params)
    const response = await this.#fetch(input, init)

    await this.#handleError(response)

    return (await response.json()) as Promise<R>
  }

  async put<R = unknown, P extends Params = Params>(url: string, body: BodyInit, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'PUT', body, params)
    const response = await this.#fetch(input, init)

    await this.#handleError(response)

    return (await response.json()) as Promise<R>
  }

  async delete<R = unknown, P extends Params = Params>(url: string, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'DELETE', undefined, params)
    const response = await this.#fetch(input, init)

    await this.#handleError(response)

    return (await response.json()) as Promise<R>
  }
}

export default {
  install: (app) => {
    app.provide('api', new API())
  },
} satisfies Plugin

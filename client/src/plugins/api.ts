import type { Plugin } from 'vue'
import type { Params } from '_/types/api'

import { isEmpty } from 'lodash-es'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type BodyInit = FormData | URLSearchParams | string | object
type OptionInit = { method: Method; body?: FormData | URLSearchParams | string }

const IS_DEV = import.meta.env.DEV
const API_URL = import.meta.env.VITE_API

export class API {
  readonly #fetch = window.fetch.bind(window)

  #getOptions<P extends Params>(url: string, method: Method, body?: BodyInit, params?: P) {
    const init: OptionInit = {
      method,
    }
    const p = !isEmpty(params) ? new URLSearchParams(params) : null
    let input = `${API_URL}${url}`

    if (!body && p) init.body = p
    else {
      if (p) input = `${input}?${p}`

      const b = body instanceof FormData ? body : JSON.stringify(body)

      init.body = b
    }

    return { input, init }
  }

  #handleError(response: globalThis.Response) {
    if (response.ok) return

    const status = response.status
    const defaultError = 'Неизвестная ошибка'

    const errors: Record<number, string> = {
      404: 'Не найдено',
    }

    const message = `${status}: ${errors[status] ?? defaultError}`

    if (IS_DEV) console.debug('[API]', message)

    throw Error(message)
  }

  async get<R = unknown, P extends Params = Params>(url: string, body?: BodyInit, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'GET', body, params)
    const response = await this.#fetch(input, init)

    this.#handleError(response)

    return (await response.json()) as Promise<R>
  }

  async post<R = unknown, P extends Params = Params>(url: string, body: BodyInit, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'POST', body, params)
    const response = await this.#fetch(input, init)

    this.#handleError(response)

    return (await response.json()) as Promise<R>
  }

  async put<R = unknown, P extends Params = Params>(url: string, body: BodyInit, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'PUT', body, params)
    const response = await this.#fetch(input, init)

    this.#handleError(response)

    return (await response.json()) as Promise<R>
  }

  async delete<R = unknown, P extends Params = Params>(url: string, params?: P) {
    const { input, init } = this.#getOptions<P>(url, 'DELETE', undefined, params)
    const response = await this.#fetch(input, init)

    this.#handleError(response)

    return (await response.json()) as Promise<R>
  }
}

export default {
  install: (app) => {
    app.provide('api', new API())
  },
} satisfies Plugin

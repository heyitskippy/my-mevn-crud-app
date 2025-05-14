/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { InputTypeHTMLAttribute } from 'vue'
import type { EntityForm, ID, IModel, Maybe, NullableEntity } from '..'
import type { Flatten } from '../utilities'
/**
 * Table
 */
export interface TableHeader<T extends Partial<NullableEntity> = Partial<NullableEntity>> {
  headerName: string
  field: keyof T
  type: 'text' | 'datetime-local' | 'select'
  options?: string
  position?: 'start' | 'center' | 'end'
}

export type TableType = IModel

export type TableCellSlots<H extends TableHeader[]> = Record<Flatten<H>['field'], any>
/**
 * Forms / fields / buttons
 */
export type FormFields<T extends EntityForm = EntityForm> = Record<
  keyof T,
  {
    label: string

    type: InputTypeHTMLAttribute | 'select'
    readonly?: { create?: boolean; edit?: boolean }
    required?: boolean

    options?: string
  }
>

export type InputValue = Maybe<string | number | Date | undefined>

export type SelectOption = { id: ID; name?: string }

export type BtnAction = 'reset' | 'save' | 'delete' | 'softDelete'
/**
 * Toast
 */
export interface ToastState {
  key: symbol
  visibility: boolean
  text: Maybe<string>
  type: 'error' | 'success'
  timeout: number
}

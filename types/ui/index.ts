/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Ref } from 'vue'
import type { EntityForm, ID, IModel, Maybe, NullableEntity } from '..'
import type { Flatten } from '../utilities'

export interface TableHeader<T extends Partial<NullableEntity> = Partial<NullableEntity>> {
  headerName: string
  field: keyof T
  type?: 'datetime' | 'text' | 'select'
  readonly?: { create?: boolean; edit?: boolean }
  options?: string
  position?: 'start' | 'center' | 'end'
}

export type TableType = IModel | NullableEntity

export type TableCellSlots<H extends TableHeader[]> = Record<Flatten<H>['field'], any>

export type FormNames<T extends EntityForm | object = EntityForm> = Record<keyof T, string>

export type InputValue = Maybe<string | number | Date | undefined>

export type SelectOption = { id: ID; name?: string }

export type BtnAction = 'reset' | 'save' | 'delete' | 'softDelete'

export type RefComponent<T extends abstract new (...args: any) => any> = Ref<Maybe<InstanceType<T>>>

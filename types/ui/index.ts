import type { Entity, EntityForm, IModel, Maybe, NullableEntity } from '..'
import type { Flatten } from '../utilities'

export interface TableHeader<T extends Entity | object = Entity> {
  headerName: string
  field: keyof T
  type?: 'datetime' | 'text'
  position?: 'start' | 'center' | 'end'
}

export type TableType = IModel | NullableEntity | object

export type TableCellSlots<H extends TableHeader[]> = Record<Flatten<H>['field'], unknown>

export type FormNames<T extends EntityForm | object = EntityForm> = Record<keyof T, string>

export type InputValue = Maybe<string | number | Date | undefined>

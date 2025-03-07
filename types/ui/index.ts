import type { Entity } from '..'
import type { Flatten } from '../utilities'

export interface TableHeader<T extends Entity | object = Entity> {
  headerName: string
  field: keyof T
  type?: 'datetime'
  position?: 'start' | 'center' | 'end'
}

export type TableCellSlots<H extends TableHeader[]> = Record<Flatten<H>['field'], unknown>

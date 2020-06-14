export interface BaseBox {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Box {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  x1: number;
  y1: number;
  mX: number;
  mY: number;
  tagName?: string;
  dataAttributes?: Record<string, any>;
  dataStyles?: Record<string, any>;
  dataText?: string;
}

export enum directEnum {
  DIRECTX = 'x',
  DIRECTY = 'y'
}

export type Direct = 'x' | 'y';

export interface MixBox extends Box {
  children: MixBox[];
  combine?: boolean;
  direct?: Direct;
  leafWrapper?: boolean;
  leaf?: boolean;
}

export interface ASTBox {
  id: string;
  name: string;
  x: number;
  y: number;
  children: MixBox[];
}

export enum layout {
  row = 0,
  col = 1
}

export interface AST {
  box: Box;
  layout: layout;
  children: AST | null;
}

export function _genBox(): Box {
  return {
    id: '',
    name: '',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
    mX: 0,
    mY: 0
  };
}

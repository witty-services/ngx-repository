export type HttpWriteOperation = 'write' | 'create' | 'update' | 'patch' | 'delete';
export type HttpReadOperation = 'read' | 'findAll' | 'findOne' | 'findById';
export type HttpOperation = HttpWriteOperation | HttpReadOperation;
export const HTTP_OPERATIONS: HttpOperation[] = ['read', 'write', 'findAll', 'findOne', 'findById', 'create', 'update', 'patch', 'delete'];
export const HTTP_WRITE_OPERATIONS: HttpWriteOperation[] = ['write', 'create', 'update', 'patch', 'delete'];

export function isHttpOperation(value: string): boolean {
  return HTTP_OPERATIONS.indexOf(value as HttpOperation) !== -1;
}

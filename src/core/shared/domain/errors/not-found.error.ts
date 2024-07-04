import { AggregateRoot } from '../aggregate-root';

export class NotFoundError extends Error {
  constructor(
    id: any[] | any,
    entityClass: new (...arg: any[]) => AggregateRoot,
  ) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} not found with id: ${idsMessage}`);
    this.name = 'NotFoundError';
  }
}

export interface Listener<E> {

  on(event: E): void;
}

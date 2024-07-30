export interface GoogleList<T> {
  kind: string;
  totalItems: number;
  items: T[];
}

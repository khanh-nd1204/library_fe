export type BookType = {
  id: number;
  name?: string;
  description?: string;
  publishYear?: number;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  authors?: {id: number, name: string}[],
  categories?: {id: number, name: string}[],
  publisher?: {id: number, name: string},
  images?: {id: number, imageUrl: string}[],
}
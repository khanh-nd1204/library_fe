export type BookType = {
  id: number;
  name?: string;
  description?: string;
  publishYear?: number;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  authors?: string[],
  categories?: string[],
  publisher?: string
}
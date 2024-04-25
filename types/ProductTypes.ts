export type ProductType = {
  id: string;
  name: string;
  description: string | null;
  image: string;
  quantity?: number | 1;
  user?: string | null;
  unit_amount: number | null;
};

export interface Mistake {
  id: string;
  userId: string;
  title: string;
  description: string;
  repetitions: {
    id: string;
    title: string;
    createdAt: number;
  }[];
  category: string;
  createdAt: number;
}

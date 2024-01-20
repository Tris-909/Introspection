export interface Mistake {
  id: string;
  userId: string;
  title: string;
  description: string;
  repetitions: {
    title: string;
    createdAt: number;
  }[];
  tags: string[];
  createdAt: number;
}

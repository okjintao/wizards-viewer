export interface Trait {
  id: number;
  name: string;
  type: string;
  frequency: number;
  tags: {
    id: number;
    name: string;
  }[];
  affinities: {
    id: number;
    name: string;
  }[];
}

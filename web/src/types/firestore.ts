import { WhereFilterOp } from "firebase/firestore";

export interface Condition {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface QueryResult {
  items: any[];
  totalCount: number;
}

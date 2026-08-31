export type AccountType = "bank" | "investment" | "voucher" | "credit" | "other";
export type TransactionKind = "expense" | "income";

export interface Category {
  id: string;
  kind: TransactionKind;
  name: string;
  color: string;
  sort_order: number;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  is_liability: boolean;
  current_balance: number;
  balance_updated_at: string;
  display_order: number;
  created_at: string;
}

export interface AccountBalanceHistoryRow {
  id: string;
  account_id: string;
  balance: number;
  recorded_at: string;
}

export interface Holiday {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  name: string;
  amount: number;
  occurred_on: string;
  notes: string | null;
  created_at: string;
}

export interface TransactionWithRefs extends Transaction {
  category: Category;
  account: Pick<Account, "id" | "name" | "type">;
}

import type { Category, TransactionWithRefs } from "@/lib/types";
import type { Dictionary } from "./dictionaries";
import { translateCategory } from "./server";

export function localizeCategories(categories: Category[], t: Dictionary): Category[] {
  return categories.map((c) => ({ ...c, name: translateCategory(t, c.name) }));
}

export function localizeTransactions(
  transactions: TransactionWithRefs[],
  t: Dictionary
): TransactionWithRefs[] {
  return transactions.map((tx) => ({
    ...tx,
    category: { ...tx.category, name: translateCategory(t, tx.category.name) },
  }));
}

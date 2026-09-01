import { getHolidays, getTransactions } from "@/lib/data";
import { summarizeHoliday } from "@/lib/spendingGrouping";
import { getT } from "@/lib/i18n/server";
import { localizeTransactions } from "@/lib/i18n/localize";
import { Card } from "@/components/ui/Card";
import { CreateHolidayForm } from "@/components/CreateHolidayForm";
import { HolidayCard } from "@/components/HolidayCard";

export default async function HolidaysPage() {
  const { t } = await getT();
  const [holidays, rawTransactions] = await Promise.all([getHolidays(), getTransactions()]);
  const transactions = localizeTransactions(rawTransactions, t);
  const expenseTx = transactions.filter((tx) => tx.category.kind === "expense");

  const summaries = holidays.map((holiday) => summarizeHoliday(holiday, expenseTx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">{t.holidays.title}</h1>
          <p className="mt-1 text-sm text-neutral">{t.holidays.subtitle}</p>
        </div>
        <CreateHolidayForm />
      </div>

      <Card>
        {summaries.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral">{t.holidays.noHolidays}</p>
        ) : (
          <div className="space-y-3">
            {summaries.map((summary) => (
              <HolidayCard key={summary.holiday.id} summary={summary} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className={clsx("rounded-xl border border-surface-border bg-surface p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-gray-100">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

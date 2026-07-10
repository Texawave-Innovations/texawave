import { CheckCircle2 } from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────
// These values are the single source of truth for the checkmark-list pattern
// used across the application. Do NOT override them inline — update here only.
//
//   Icon:             CheckCircle2, 16 px, color = #8CC63F (--color-signal)
//   Icon → text gap:  10 px  (gap-2.5)
//   Item top margin:  2 px   (mt-[2px]) — optical alignment to text baseline
//   Vertical spacing: 14 px  (gap-3.5) between list items
//   Text style:       14 px, font-medium — overridable via itemClassName

export interface CheckListProps {
  /** Array of plain-text list items */
  items: string[];
  /** Extra classes applied to the outer <ul> wrapper */
  className?: string;
  /** Extra classes applied to each <li> text node.
   *  Use this to override color / weight for different background contexts,
   *  e.g. dark card vs light sidebar. */
  itemClassName?: string;
  /** Icon size in px. Defaults to 16.
   *  Only override when the surrounding context (e.g. a very compact dark
   *  popup) genuinely requires a smaller icon. */
  iconSize?: number;
}

export function CheckList({
  items,
  className = "",
  itemClassName = "text-text-secondary",
  iconSize = 16,
}: CheckListProps) {
  return (
    <ul className={`flex flex-col gap-3.5 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-2.5 text-[14px] font-medium leading-snug ${itemClassName}`}
        >
          <CheckCircle2
            size={iconSize}
            className="shrink-0 mt-[2px] text-signal"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

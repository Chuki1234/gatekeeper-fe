import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-8", className)}>
      <Icon className="text-charcoalMuted" size={18} />
      <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoalMuted">
        {title}
      </h2>
      <div className="flex-1 h-px bg-borderMain ml-4" />
    </div>
  );
}

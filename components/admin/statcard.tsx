import { Utensils, Ticket, Mail, Armchair } from 'lucide-react';

const ICONS = {
  brand:  { Icon: Utensils, cls: 'text-brand-500' },
  amber:  { Icon: Ticket,   cls: 'text-amber-400' },
  blue:   { Icon: Mail,     cls: 'text-blue-400'  },
  purple: { Icon: Armchair, cls: 'text-purple-400' },
} as const;

interface Props {
  label: string;
  value: string | number;
  hint: string;
  tone: keyof typeof ICONS;
}

export default function StatCard({ label, value, hint, tone }: Props) {
  const { Icon, cls } = ICONS[tone];
  return (
    <div className="glass-card p-4 rounded-2xl border border-brand-border space-y-2">
      <div className="flex items-center justify-between text-gray-400">
        <span className="text-xs font-semibold">{label}</span>
        <Icon className={`w-4 h-4 ${cls}`} />
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] text-gray-400">{hint}</p>
    </div>
  );
}
// components/ui/SummaryCard.tsx
type SummaryCardProps = {
  title: string;
  value: number;
  icon: JSX.Element;
};

export default function SummaryCard({ title, value, icon }: SummaryCardProps) {
  return (
    <div className="flex justify-between items-center p-3 bg-white shadow-md rounded-lg w-[370px] h-[100px]">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className="text-3xl text-gray-400">
        {icon}
      </div>
    </div>
  );
}

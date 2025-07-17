// components/ui/summarycard.tsx
type SummaryCardIncomeProps = {
  title: string;
  value: number | string;
  icon: JSX.Element;
};

export default function SummaryCardIncome({ title, value, icon }: SummaryCardIncomeProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg w-[270px] h-[100px]">
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

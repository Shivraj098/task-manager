type Props = {
  title: string;
};

export default function Topbar({ title }: Props) {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="text-sm text-gray-500">
        {/* Placeholder for user later */}
        Logged in
      </div>
    </div>
  );
}
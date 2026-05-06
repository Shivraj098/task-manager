export default function CardSkeleton() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-1/2 rounded-xl bg-gray-200" />

        <div className="h-4 w-1/3 rounded-xl bg-gray-100" />

        <div className="h-10 w-28 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}
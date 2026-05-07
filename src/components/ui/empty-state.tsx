type Props = {
  title: string;
  description: string;
};

export function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-gray-200
        py-14
        text-center
      "
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}
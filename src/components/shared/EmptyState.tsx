type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-gray-200
        bg-white/70
        px-6
        py-16
        text-center
        shadow-sm
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-3xl
          bg-gray-100
        "
      >
        <div
          className="
            h-6
            w-6
            rounded-full
            bg-gray-300
          "
        />
      </div>

      <h3 className="text-lg font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}
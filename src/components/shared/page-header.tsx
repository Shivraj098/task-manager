type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
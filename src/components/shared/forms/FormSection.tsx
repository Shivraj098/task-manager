type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
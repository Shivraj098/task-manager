type FormTextareaProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  error?: string;
  disabled?: boolean;
};

export default function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label
        className="
          block
          text-sm
          font-semibold
          text-gray-700
        "
      >
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={5}
        className={`
          w-full
          rounded-2xl
          border
          bg-white
          px-4
          py-3
          text-sm
          shadow-sm
          transition-all
          focus:border-black
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            error
              ? "border-red-300"
              : "border-gray-200"
          }
        `}
      />

      {error && (
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
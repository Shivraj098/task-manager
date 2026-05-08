type FormInputProps = {
  id?: string;

  label: string;

  placeholder?: string;

  value: string;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  error?: string;

  disabled?: boolean;

  type?: string;
};

export default function FormInput({
  id,

  label,

  placeholder,

  value,

  onChange,

  error,

  disabled,

  type = "text",
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="
          block
          text-sm
          font-semibold
          text-gray-700
        "
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          h-12
          w-full
          rounded-2xl
          border
          bg-white
          px-4
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
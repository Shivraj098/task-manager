type Status =
  | "PENDING"
  | "IN_PROGRESS"
  | "DONE";

type Props = {
  status: Status;
};

const styles: Record<
  Status,
  string
> = {
  PENDING:
    "bg-gray-100 text-gray-700 border border-gray-200",

  IN_PROGRESS:
    "bg-blue-50 text-blue-700 border border-blue-200",

  DONE:
    "bg-green-50 text-green-700 border border-green-200",
};

export function StatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${styles[status]}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}
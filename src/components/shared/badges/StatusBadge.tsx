type Status =
  | "PENDING"
  | "IN_PROGRESS"
  | "DONE";

type StatusBadgeProps = {
  status: Status;
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    PENDING:
      "bg-gray-100 text-gray-700 border-gray-200",

    IN_PROGRESS:
      "bg-blue-50 text-blue-700 border-blue-200",

    DONE:
      "bg-green-50 text-green-700 border-green-200",
  };

  const labels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    DONE: "Completed",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}
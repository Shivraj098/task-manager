type Props = {
  title: string;
};

export default function Topbar({ title }: Props) {
  return (
    <div
      className="
        sticky
        top-0
        z-30
        flex
        h-20
        items-center
        justify-between
        border-b
        border-white/40
        bg-white/70
        px-6
        backdrop-blur-2xl
      "
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm font-medium text-gray-500">
          Manage tasks, projects, and team collaboration.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="
            hidden
            sm:flex
            items-center
            gap-3
            rounded-2xl
            border
            border-gray-200
            bg-white/90
            px-4
            py-2
            shadow-sm
          "
        >
          <div
            className="
              h-3
              w-3
              rounded-full
              bg-green-500
              animate-pulse
            "
          />

          <span className="text-sm font-medium text-gray-700">
            Live Workspace
          </span>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-black
            text-sm
            font-bold
            text-white
            shadow-lg
          "
        >
          U
        </div>
      </div>
    </div>
  );
}
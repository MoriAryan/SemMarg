interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-24 px-4">
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-[320px] leading-relaxed mb-4">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}


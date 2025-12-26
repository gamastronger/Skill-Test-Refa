function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Input({ className, ...props }) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-primary-700 focus:ring-4 focus:ring-primary-500/20",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

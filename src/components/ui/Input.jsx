function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Input({ className, ...props }) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

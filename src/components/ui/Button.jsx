function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Button({ as = "button", variant = "secondary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition " +
    "focus:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary: "bg-[#1C4D8D] text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900/15",
    secondary: "text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900/10",
    success: "bg-[#1C4D8D] text-white shadow-sm hover:bg-[#0F2854] focus-visible:ring-emerald-600/15",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-600/15",
    ghost: "text-slate-700 hover:bg-slate-100/70 focus-visible:ring-slate-900/10",
  };

  const Comp = as;
  return <Comp className={cx(base, styles[variant], className)} {...props} />;
}

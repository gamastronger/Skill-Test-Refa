import { useMemo, useState } from "react";

export default function useUserFilters(users) {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!query) return users || [];
    const q = query.toLowerCase();
    return (users || []).filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      const username = (u.username || "").toLowerCase();
      return (
        name.includes(q) || email.includes(q) || username.includes(q)
      );
    });
  }, [users, query]);

  return { query, setQuery, filteredUsers };
}

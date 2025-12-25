import { useMemo, useState } from "react";
import Button from "./ui/Button";
import Field from "./ui/Field";
import Input from "./ui/Input";

function SectionTitle({ children }) {
  return (
    <div className="pt-2">
      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{children}</p>
    </div>
  );
}

export default function UserCreateForm({ loading, error, onSubmit, onCancel }) {
  const initialNewUser = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      address: { address: "", city: "", state: "", postalCode: "" },
      company: { name: "", title: "", department: "" },
    }),
    []
  );

  const [newUser, setNewUser] = useState(initialNewUser);

  return (
    <form
      className="p-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(newUser, () => setNewUser(initialNewUser));
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First name">
          <Input
            value={newUser.firstName}
            onChange={(e) => setNewUser((v) => ({ ...v, firstName: e.target.value }))}
            placeholder="John"
          />
        </Field>

        <Field label="Last name">
          <Input
            value={newUser.lastName}
            onChange={(e) => setNewUser((v) => ({ ...v, lastName: e.target.value }))}
            placeholder="Doe"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Email">
          <Input
            value={newUser.email}
            onChange={(e) => setNewUser((v) => ({ ...v, email: e.target.value }))}
            placeholder="john@company.com"
          />
        </Field>

        <Field label="Phone">
          <Input
            value={newUser.phone}
            onChange={(e) => setNewUser((v) => ({ ...v, phone: e.target.value }))}
            placeholder="+62…"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Username">
          <Input
            value={newUser.username}
            onChange={(e) => setNewUser((v) => ({ ...v, username: e.target.value }))}
            placeholder="johndoe"
            autoComplete="username"
          />
        </Field>

        <Field label="Password">
          <Input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser((v) => ({ ...v, password: e.target.value }))}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
      </div>

      <SectionTitle>Address</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Street">
          <Input
            value={newUser.address.address}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              address: { ...v.address, address: e.target.value },
            }))}
            placeholder="Jl. Sudirman…"
          />
        </Field>

        <Field label="City">
          <Input
            value={newUser.address.city}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              address: { ...v.address, city: e.target.value },
            }))}
            placeholder="Jakarta"
          />
        </Field>

        <Field label="State">
          <Input
            value={newUser.address.state}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              address: { ...v.address, state: e.target.value },
            }))}
            placeholder="DKI Jakarta"
          />
        </Field>

        <Field label="Postal code">
          <Input
            value={newUser.address.postalCode}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              address: { ...v.address, postalCode: e.target.value },
            }))}
            placeholder="10220"
          />
        </Field>
      </div>

      <SectionTitle>Company</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company name">
          <Input
            value={newUser.company.name}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              company: { ...v.company, name: e.target.value },
            }))}
            placeholder="Acme Inc."
          />
        </Field>

        <Field label="Title">
          <Input
            value={newUser.company.title}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              company: { ...v.company, title: e.target.value },
            }))}
            placeholder="Designer"
          />
        </Field>

        <Field label="Department">
          <Input
            value={newUser.company.department}
            onChange={(e) => setNewUser((v) => ({
              ...v,
              company: { ...v.company, department: e.target.value },
            }))}
            placeholder="Product"
          />
        </Field>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="success" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Creating…
            </span>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}

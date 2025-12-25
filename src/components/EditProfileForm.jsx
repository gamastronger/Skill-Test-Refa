import { useMemo, useState } from "react";

function validate(values) {
  const errors = {};
  if (!values.firstName?.trim()) errors.firstName = "First name is required";
  if (!values.lastName?.trim()) errors.lastName = "Last name is required";
  if (!values.email?.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Invalid email format";
  if (!values.phone?.trim()) errors.phone = "Phone is required";
  // Optional nested validations
  if (values.address) {
    if (!values.address.address?.trim()) errors.address_address = "Street address is required";
    if (!values.address.city?.trim()) errors.address_city = "City is required";
    if (!values.address.state?.trim()) errors.address_state = "State is required";
    if (!values.address.postalCode?.toString()?.trim()) errors.address_postalCode = "Postal code is required";
  }
  if (values.company) {
    if (!values.company.name?.trim()) errors.company_name = "Company name is required";
    if (!values.company.title?.trim()) errors.company_title = "Title is required";
    if (!values.company.department?.trim()) errors.company_department = "Department is required";
  }
  return errors;
}

export default function EditProfileForm({ user, onSave, onCancel }) {
  const initial = useMemo(
    () => ({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      address: {
        address: user.address?.address ?? "",
        city: user.address?.city ?? "",
        state: user.address?.state ?? "",
        postalCode: user.address?.postalCode ?? "",
      },
      company: {
        name: user.company?.name ?? "",
        title: user.company?.title ?? "",
        department: user.company?.department ?? "",
      },
    }),
    [user]
  );

  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function setNestedField(section, field, value) {
    setValues((v) => ({ ...v, [section]: { ...(v[section] || {}), [field]: value } }));
  }

  function markTouched(name) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function handleBlur(name) {
    markTouched(name);
    setErrors(validate(values));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address_address: true,
      address_city: true,
      address_state: true,
      address_postalCode: true,
      company_name: true,
      company_title: true,
      company_department: true,
    });
    if (Object.keys(nextErrors).length > 0) return;
    onSave(values);
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="First Name"
          value={values.firstName}
          onChange={(v) => setField("firstName", v)}
          onBlur={() => handleBlur("firstName")}
          error={touched.firstName ? errors.firstName : null}
        />
        <Field
          label="Last Name"
          value={values.lastName}
          onChange={(v) => setField("lastName", v)}
          onBlur={() => handleBlur("lastName")}
          error={touched.lastName ? errors.lastName : null}
        />
      </div>

      <Field
        label="Email"
        value={values.email}
        onChange={(v) => setField("email", v)}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : null}
      />

      <Field
        label="Phone"
        value={values.phone}
        onChange={(v) => setField("phone", v)}
        onBlur={() => handleBlur("phone")}
        error={touched.phone ? errors.phone : null}
      />

      {/* Address */}
      <div className="pt-2">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Street"
            value={values.address.address}
            onChange={(v) => setNestedField("address", "address", v)}
            onBlur={() => handleBlur("address_address")}
            error={touched.address_address ? errors.address_address : null}
          />
          <Field
            label="City"
            value={values.address.city}
            onChange={(v) => setNestedField("address", "city", v)}
            onBlur={() => handleBlur("address_city")}
            error={touched.address_city ? errors.address_city : null}
          />
          <Field
            label="State"
            value={values.address.state}
            onChange={(v) => setNestedField("address", "state", v)}
            onBlur={() => handleBlur("address_state")}
            error={touched.address_state ? errors.address_state : null}
          />
          <Field
            label="Postal Code"
            value={values.address.postalCode}
            onChange={(v) => setNestedField("address", "postalCode", v)}
            onBlur={() => handleBlur("address_postalCode")}
            error={touched.address_postalCode ? errors.address_postalCode : null}
          />
        </div>
      </div>

      {/* Company */}
      <div className="pt-2">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Company</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Company Name"
            value={values.company.name}
            onChange={(v) => setNestedField("company", "name", v)}
            onBlur={() => handleBlur("company_name")}
            error={touched.company_name ? errors.company_name : null}
          />
          <Field
            label="Title"
            value={values.company.title}
            onChange={(v) => setNestedField("company", "title", v)}
            onBlur={() => handleBlur("company_title")}
            error={touched.company_title ? errors.company_title : null}
          />
          <Field
            label="Department"
            value={values.company.department}
            onChange={(v) => setNestedField("company", "department", v)}
            onBlur={() => handleBlur("company_department")}
            error={touched.company_department ? errors.company_department : null}
          />
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition" type="submit">
          Save
        </button>
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, onBlur, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        className={`mt-1 w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
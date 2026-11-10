"use client";

import { FormEvent } from "react";

type Field = "name" | "email" | "message";

export function EmailForm({
  to,
  subject,
  submitLabel,
  fields,
}: {
  to: string;
  subject: string;
  submitLabel: string;
  fields: Field[];
}) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = fields.map((field) => {
      const label = field[0].toUpperCase() + field.slice(1);
      return `${label}: ${String(data.get(field) ?? "")}`;
    });
    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join("\n"),
    )}`;
    window.location.href = href;
  }

  return (
    <form onSubmit={onSubmit}>
      {fields.includes("name") ? (
        <label className="field">
          Name *
          <input name="name" required autoComplete="name" />
        </label>
      ) : null}
      {fields.includes("email") ? (
        <label className="field">
          Email *
          <input name="email" type="email" required autoComplete="email" />
        </label>
      ) : null}
      {fields.includes("message") ? (
        <label className="field">
          Message *
          <textarea name="message" required rows={6} />
        </label>
      ) : null}
      <button className="button" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

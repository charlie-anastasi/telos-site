"use client";

import { forms, type FormName } from "@/content/site";
import { FORM_ERROR, useFormspree } from "./useFormspree";

export function ContactForm({ form }: { form: FormName }) {
  const { status, onSubmit, action } = useFormspree(form);
  const id = (name: string) => `${form}-${name}`;

  if (status === "sent") {
    return (
      <div className="form-card" role="status">
        {forms.thanks}
      </div>
    );
  }

  return (
    <div className="form-card">
      <form action={action} method="POST" onSubmit={onSubmit}>
        <fieldset>
          <legend>Name</legend>
          <div className="form-field">
            <label className="form-caption fluid" htmlFor={id("fname")}>
              First Name
            </label>
            <input id={id("fname")} name="fname" type="text" autoComplete="given-name" />
          </div>
          <div className="form-field">
            <label className="form-caption fluid" htmlFor={id("lname")}>
              Last Name
            </label>
            <input id={id("lname")} name="lname" type="text" autoComplete="family-name" />
          </div>
        </fieldset>

        <div className="form-field">
          <label className="form-label" htmlFor={id("email")}>
            Email
            <span className="form-required fluid">(required)</span>
          </label>
          <input id={id("email")} name="email" type="email" autoComplete="email" required />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor={id("message")}>
            Additional Details
          </label>
          <textarea id={id("message")} name="message" />
        </div>

        <div className="form-trap" aria-hidden="true">
          <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
        {status === "error" && (
          <p className="form-status" role="alert">
            {FORM_ERROR}
          </p>
        )}
      </form>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { forms, type FormName } from "@/content/site";

type Status = "idle" | "submitting" | "sent" | "error";

/** Posts a form to Formspree without leaving the page. */
export function useFormspree(form: FormName) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("_subject", forms.subjects[form]);
    data.set("form", form);
    setStatus("submitting");
    try {
      const response = await fetch(forms.endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return { status, onSubmit, action: forms.endpoint };
}

export const FORM_ERROR = "Unable to send form. Please try again later.";

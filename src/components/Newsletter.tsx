"use client";

import { footer, forms } from "@/content/site";
import { FORM_ERROR, useFormspree } from "./useFormspree";

export function Newsletter() {
  const { status, onSubmit, action } = useFormspree("newsletter");

  return (
    <div className="newsletter">
      <form action={action} method="POST" onSubmit={onSubmit}>
        <header>
          <h2>{footer.newsletterTitle}</h2>
          <div className="newsletter-description">
            <p>{footer.newsletterDescription}</p>
          </div>
        </header>

        <div className="newsletter-body">
          {status === "sent" ? (
            <p role="status">{forms.thanks}</p>
          ) : (
            <>
              <div className="newsletter-field">
                <label className="visually-hidden" htmlFor="newsletter-email">
                  {footer.newsletterPlaceholder}
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={footer.newsletterPlaceholder}
                  required
                />
              </div>{" "}
              <div className="newsletter-submit">
                <button type="submit" disabled={status === "submitting"}>
                  {footer.newsletterButton}
                </button>
              </div>
              {status === "error" && (
                <p className="form-status" role="alert">
                  {FORM_ERROR}
                </p>
              )}
            </>
          )}
        </div>

        <div className="newsletter-footnote fluid">
          <p>{footer.disclaimer}</p>
          <p>{footer.copyright}</p>
        </div>
      </form>
    </div>
  );
}

import { site } from "@/content/site";

export function SocialLinks() {
  return (
    <nav className="social" aria-label="Social">
      <a href={`mailto:${site.email}`} target="_blank" rel="noopener" aria-label={site.email}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M17 22v20h30V22H17zm25.4 3L32 33.4 21.6 25h20.8zM20 39V27.3l12 9.7 12-9.7V39H20z" />
        </svg>
      </a>
      <a href={site.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M20.4 44h5.4V26.6h-5.4V44zm2.7-26c-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1zm6.1 26h5.4v-8.6c0-2.3.4-4.5 3.2-4.5 2.8 0 2.8 2.6 2.8 4.6V44H46v-9.5c0-4.7-1-8.3-6.5-8.3-2.6 0-4.4 1.4-5.1 2.8h-.1v-2.4h-5.2V44z" />
        </svg>
      </a>
    </nav>
  );
}

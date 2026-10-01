"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";

const Chevron = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 22 22" aria-hidden="true">
    <path d={back ? "M15 4 7 11l8 7" : "M7 4l8 7-8 7"} />
  </svg>
);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // label of the folder shown in the mobile menu, if any
  const [folder, setFolder] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setFolder(null);
  };
  const current = (href: string) => (pathname === href ? ("page" as const) : undefined);

  return (
    <header className={open ? "header header--open" : "header"}>
      <a className="skip-link" href="#page">
        Skip to Content
      </a>

      <div className="header-bar">
        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span className="visually-hidden">{open ? "Close Menu" : "Open Menu"}</span>
          <span className="burger-box" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <div className="header-logo">
          <Link href="/" onClick={close}>
            <Image src="/images/telos-logo-transparent.png" alt={site.logoAlt} width={98} height={133} preload />
          </Link>
        </div>

        <nav className="header-nav" aria-label="Main">
          {nav.map((item) =>
            "items" in item ? (
              <div
                key={item.label}
                className={
                  item.items.some((i) => i.href === pathname)
                    ? "header-nav-item header-nav-item--active"
                    : "header-nav-item"
                }
              >
                <button type="button" aria-haspopup="true">
                  <span>{item.label}</span>
                </button>
                <div className="header-folder">
                  {item.items.map((i) => (
                    <Link key={i.href} href={i.href} aria-current={current(i.href)}>
                      <span>{i.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div key={item.href} className="header-nav-item">
                <Link href={item.href} aria-current={current(item.href)}>
                  <span>{item.label}</span>
                </Link>
              </div>
            ),
          )}
        </nav>
      </div>

      <div id="menu" className={folder ? "menu menu--folder" : "menu"} aria-hidden={!open}>
        <nav className="menu-panels" aria-label="Menu">
          <div className="menu-panel menu-panel--root">
            {nav.map((item) => (
              <div
                key={item.label}
                className={
                  "items" in item && item.items.some((i) => i.href === pathname)
                    ? "menu-item menu-item--active"
                    : "menu-item"
                }
              >
                {"items" in item ? (
                  <button type="button" tabIndex={open ? 0 : -1} onClick={() => setFolder(item.label)}>
                    <span>{item.label}</span>
                    <Chevron />
                  </button>
                ) : (
                  <Link href={item.href} tabIndex={open ? 0 : -1} onClick={close}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {nav.map(
            (item) =>
              "items" in item && (
                <div key={item.label} className="menu-panel menu-panel--folder" hidden={folder !== item.label}>
                  <div className="menu-item menu-item--back">
                    <button type="button" onClick={() => setFolder(null)}>
                      <Chevron back />
                      Back
                    </button>
                  </div>
                  {item.items.map((i) => (
                    <div key={i.href} className="menu-item">
                      <Link href={i.href} onClick={close}>
                        {i.label}
                      </Link>
                    </div>
                  ))}
                </div>
              ),
          )}
        </nav>
      </div>
    </header>
  );
}

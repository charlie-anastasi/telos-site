// Site-wide content. Anything that appears on more than one page lives here
// so a copy change happens in one place.

export const site = {
  name: "Telos",
  url: "https://www.teloscollege.org",
  title: "Telos - A Modern Work College",
  description:
    "Telos is building a Modern Work College in Philadelphia where students earn credit and income for campus jobs and internships that count toward their degree.",
  logoAlt: "TELOS by Charlie Anastasi",
  email: "charlie@teloscollege.org",
  linkedin: "http://linkedin.com/in/charlie-anastasi",
};

export type NavItem = { label: string; href: string } | { label: string; items: { label: string; href: string }[] };

export const nav: NavItem[] = [
  {
    label: "Pilot Program",
    items: [
      { label: "Overview", href: "/pilot" },
      { label: "For Students", href: "/pilot-students" },
      { label: "For Employers", href: "/pilot-employers" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footer = {
  founder: "Telos is led by founder Charlie Anastasi.",
  newsletterTitle: "Follow the journey",
  newsletterDescription: "Join our list for updates as Telos takes shape.",
  newsletterPlaceholder: "Email Address",
  newsletterButton: "Sign Up",
  disclaimer:
    "Telos is in active development and is not currently enrolling students or conferring degrees. Telos is not yet authorized to operate as an institution of higher education in the Commonwealth of Pennsylvania.",
  copyright: "© 2026 Telos. Philadelphia, PA.",
};

// Forms post to Formspree, which emails each submission to charlie@teloscollege.org.
// Set NEXT_PUBLIC_FORMSPREE_ID to the form's ID (the part after /f/ in its endpoint).
const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export const forms = {
  endpoint: formspreeId ? `https://formspree.io/f/${formspreeId}` : null,
  thanks: "Thank you!",
  subjects: {
    contact: "Telos website: contact form",
    "contact-1": "Telos website: pilot early access",
    newsletter: "Telos website: newsletter sign-up",
  },
};

export type FormName = keyof typeof forms.subjects;

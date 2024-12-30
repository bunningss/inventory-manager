export const pagesData = [
  {
    label: "home",
    icon: "house",
    slug: "/",
  },
  {
    label: "about us",
    icon: "info",
    slug: "/about-us",
  },
  {
    label: "contact us",
    icon: "contact",
    slug: "/contact-us",
  },
  {
    label: "FAQs",
    icon: "circle-help",
    slug: "/faqs",
  },
  {
    label: "track order",
    icon: "audio-waveform",
    slug: "/track-order",
  },
];

export const permissions = {
  admin: {
    can: ["manage:all"],
  },
  salesman: {
    can: ["view:dashboard-data", "view:dashboard", "view:self", "update:self"],
  },
  user: {
    can: ["view:self", "update:self"],
  },
};

// update:roles

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
    can: [
      "view:dashboard-data",
      "view:dashboard",
      "view:self",
      "update:self",
      "place:order",
      "view:self-order",
    ],
  },
  user: {
    can: ["view:profile", "update:profile", "place:order"],
  },
};

// view:user-details
// update:user-details
// add:coupon
// view:coupons
// view:users
// delete:users
// view:orders
// view:others-order
// update:order-details
// view:sales
// view:sale-details
// add:sale
// update:sale-details
// update:product
// view:expenses
// add:category
// add:product
// upload:files
// delete:product
// add:category
// delete:category
// edit:product

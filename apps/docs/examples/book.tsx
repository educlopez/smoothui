"use client";

import Book from "@repo/smoothui/components/book";

const StripeDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Book title="The art of smooth interfaces" />
  </div>
);

const SimpleDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Book
      color="#7DC1C1"
      textColor="white"
      title="Design Engineering Handbook"
      variant="simple"
    />
  </div>
);

const CustomColorDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Book color="#9D2127" title="Building for the modern web" />
  </div>
);

export const demoScenes = {
  "Custom Color": CustomColorDemo,
  Features: StripeDemo,
  Simple: SimpleDemo,
  Stripe: StripeDemo,
};

export default function BookDemo() {
  return <StripeDemo />;
}

"use client";

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "@repo/smoothui/components/accordion";

const FeaturesDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <AccordionRoot className="w-full max-w-md" defaultValue={["shipping"]}>
      <AccordionItem value="shipping">
        <AccordionHeader>
          <AccordionTrigger>Shipping</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Free worldwide shipping on orders over $100. Delivery in 3–5 days.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionHeader>
          <AccordionTrigger>Returns</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          30-day returns. Items must be unused and in original packaging.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionHeader>
          <AccordionTrigger>Warranty</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Two-year limited warranty covering manufacturing defects.
        </AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  </div>
);

const MultipleDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <AccordionRoot
      className="w-full max-w-md"
      defaultValue={["plan", "billing"]}
      multiple
    >
      <AccordionItem value="plan">
        <AccordionHeader>
          <AccordionTrigger>Plan</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Pro · 5 seats · billed yearly</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionHeader>
          <AccordionTrigger>Billing</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Next invoice on Apr 12 · Visa ···· 4242</AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  </div>
);

const DisabledDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <AccordionRoot className="w-full max-w-md" defaultValue={["general"]}>
      <AccordionItem value="general">
        <AccordionHeader>
          <AccordionTrigger>General</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Workspace name, timezone, and locale.</AccordionPanel>
      </AccordionItem>
      <AccordionItem disabled value="danger">
        <AccordionHeader>
          <AccordionTrigger>Danger zone</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Delete workspace permanently.</AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  </div>
);

export const demoScenes = {
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
  Multiple: MultipleDemo,
};

export default function AccordionDemo() {
  return <FeaturesDemo />;
}

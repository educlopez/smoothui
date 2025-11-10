"use client";

import BasicAccordion from "@repo/smoothui/components/basic-accordion";

const Example = () => {
  const accordionItems = [
    {
      id: 1,
      title: "What is SmoothUI?",
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            SmoothUI is a collection of beautifully animated React components
            built with Framer Motion and Tailwind CSS.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Each component is designed with smooth animations and modern design
            principles in mind.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "How do I install SmoothUI?",
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            You can install SmoothUI using npm or yarn:
          </p>
          <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
            npm install @repo/smoothui
          </code>
        </div>
      ),
    },
    {
      id: 3,
      title: "Can I customize the components?",
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            Yes! All components accept className props and can be customized
            with Tailwind CSS classes.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            You can also modify the animation properties and styling to match
            your design system.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h3 className="mb-4 font-semibold text-lg">Frequently Asked Questions</h3>
      <BasicAccordion
        allowMultiple={true}
        defaultExpandedIds={[1]}
        items={accordionItems}
      />
    </div>
  );
};

export default Example;

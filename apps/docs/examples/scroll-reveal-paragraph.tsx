import ScrollRevealParagraph from "@repo/smoothui/components/scroll-reveal-paragraph";
// TODO: Fix this component
export default function ScrollRevealParagraphDemo() {
  const longParagraph = `Lorem ipsum dolor sit amet,
  consectetur adipiscing elit. Sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation
   ullamco laboris nisi ut aliquip ex ea commodo
   consequat. Duis aute irure dolor in reprehenderit`;

  return (
    <div className="mt-44 w-full p-8">
      <ScrollRevealParagraph
        className="text-foreground"
        paragraph={longParagraph}
      />
    </div>
  );
}

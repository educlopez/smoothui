"use client";

import Book from "@repo/smoothui/components/book";

const BookDemo = () => (
  <div className="flex min-h-[350px] flex-wrap items-center justify-center gap-8">
    {/* Default stripe variant */}
    <Book title="The art of smooth interfaces" />

    {/* Simple variant with custom color */}
    <Book
      color="#7DC1C1"
      textColor="white"
      title="Design Engineering Handbook"
      variant="simple"
    />

    {/* Custom color stripe variant */}
    <Book color="#9D2127" title="Building for the modern web" />
  </div>
);

export default BookDemo;

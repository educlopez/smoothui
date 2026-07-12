import { FooterBody } from "@docs/components/landing/footer";

export default function DocsFooter() {
  return (
    <footer className="py-12 sm:py-16 md:ps-60 xl:pe-[268px]">
      <div className="mx-auto w-full max-w-[calc(56.25rem+4rem)]">
        <FooterBody />
      </div>
    </footer>
  );
}

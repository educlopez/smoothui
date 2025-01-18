import { Breadcrumbs } from "@/app/doc/_components/breadcrumbs"

export default function UiPage() {
  return (
    <>
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="Browse Components" />
        <div className="space-y-3.5">
          <h1 className="text-3xl font-bold -tracking-wide text-light12 dark:text-dark12">
            Browse Components
          </h1>
          <p className="text-[16px] font-normal leading-relaxed text-light11 dark:text-dark11">
            Navigate to all the components that will make your application
            sophisticated and luxurious.
          </p>
        </div>
      </div>
      <div className="grid gap-x-9 gap-y-12 md:grid-cols-2"></div>
    </>
  )
}

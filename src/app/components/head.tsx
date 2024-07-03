import Image from "next/image"

import Logo from "./../../../public/images/icon.png"

export default function Head() {
  return (
    <div className="my-10 flex flex-col items-center justify-center gap-10 px-4">
      <Image src={Logo} alt="Logo SmoothUI" width={100} />
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-light12 transition dark:text-dark12">
          SmoothUI
        </h1>
        <h2 className="text-center text-lg text-light11 transition dark:text-dark11">
          A collection of <span className="line-through">awesome</span> test
          components
          <br /> with smooth animations
        </h2>
      </div>
    </div>
  )
}

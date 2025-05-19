import Image from "next/image"
import Banner from "@p/svgs/banner.svg"
import ProductSection from "@/components/productSection"
import BenefitSection from "@/components/benefitSection/index."
import PopularQuestion from "@/components/popularQuestion/index"
import MembershipSection from "@/components/membershipSection/index"
import CommunicationSection from "@/components/CommunicationSection/index"

export default function HomePage() {
  return (
    <>
      <div className="relative w-full h-screen">
        <Image
          src={Banner}
          alt="image"
          fill
          className="object-cover"
        />
        <div className="absolute top-10 left-14 text-white flex flex-col items-start gap-4 max-w-xl">
          <h1 className="text-[80px] font-bold w-[600px]">
            Simple tools for learning and productivity.
          </h1>
          <p className="text-white text-xl leading-relaxed">
            Search millions of study sets or create your own. Improve your grades and productivity with studying tools like flashcards, notes, note-taking templates, practice tests, and study planners.
          </p>
          <div className="px-8 py-2 bg-[#4255ff] rounded-sm font-medium cursor-pointer">
            Get Started
          </div>
        </div>
      </div>
      <div className="bg-gray-200 flex w-full flex-col justify-center  items-center">
        <ProductSection />
        <BenefitSection />
        <MembershipSection />
        <PopularQuestion />
        <CommunicationSection />
      </div>

    </>
  )
}

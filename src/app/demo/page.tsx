import GoogleButton from "@/components/common/SvgsComponents/GoogleButton"
import { Input, Checkbox, Button } from "antd"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#0a1e36] p-12 text-white md:flex">
        <div className="relative z-10">
          <div className="mb-4 flex items-center">
            <div className="mr-4 text-6xl font-bold text-white">
              <Image src="/salesflow-logo.png" alt="SalesFlow Logo" width={80} height={80} priority />
            </div>
            <div>
              <h1 className="text-5xl font-bold">SalesFlow</h1>
              <p className="text-sm text-gray-300">Comprehensive sales management solution</p>
            </div>
          </div>
          <div className="mt-auto">
            <p className="mt-24 text-xl font-medium leading-relaxed">
              &quot;Optimize processes – Increase sales – Manage effectively from warehouse to customer.&quot;
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/geometric-bg.png')] bg-cover bg-center opacity-20"></div>
      </div>

      <div className="flex w-full items-center justify-center bg-white md:w-1/2">
        <div className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600">Let&apos;s explore this exciting platform together!</p>
          </div>

          <GoogleButton />


          <div className="relative mb-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input id="email" type="email" placeholder="tripconnect@trip.vn" className="w-full" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input id="password" type="password" placeholder="••••••••" className="w-full" />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button className="w-full bg-[#0a4d7c] hover:bg-[#083d63]">Login</Button>

            <div className="mt-6 text-center text-sm">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

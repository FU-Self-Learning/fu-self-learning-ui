import { Input, Checkbox, Button } from "antd"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left side - Background and branding */}
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

      {/* Right side - Login form */}
      <div className="flex w-full items-center justify-center bg-white md:w-1/2">
        <div className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600">Let&apos;s explore this exciting platform together!</p>
          </div>

          {/* Google login button */}
          <button className="mb-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Using Google account
          </button>

          {/* Divider */}
          <div className="relative mb-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Login form */}
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

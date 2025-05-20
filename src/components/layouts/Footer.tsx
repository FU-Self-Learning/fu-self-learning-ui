export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold">Studee</h1>
          <p className="uppercase text-sm mt-1 font-semibold">
            future unified study environment
          </p>
          <p className="text-sm mt-4">
            A place where people can exchange and learn directly through the internet easily and effectively.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-3">Organization</h2>
          <ul className="space-y-2 text-sm">
            <li>Studee</li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-3">Product</h2>
          <ul className="space-y-2 text-sm">
            <li>Account Packages</li>
            <li>Asked Question</li>
            <li>Feedback</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 text-sm flex justify-between flex-col md:flex-row">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Impressum</a>
        </div>
        <p className="text-gray-400">&copy; 2025 Future unified study environment. All rights reserved.</p>
      </div>
    </footer>
  );
}

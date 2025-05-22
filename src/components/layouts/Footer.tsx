export default function Footer() {
  return (
    <>
      <div className="w-full -scale-y-100 h-[6px]">
        <div className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 80"
            className="w-full mb-3"
            style={{
              filter: "drop-shadow( 0px 3px rgba(0, 0, 0, 0.4))",
            }}
          >
            <path
              fill=""
              fillOpacity="1"
              transform="scale(1, -1) translate(0, -47)"
              d="M0,40 
     Q10,42 20,41 
     Q30,39 40,40 
     Q50,42 60,41 
     Q70,39 80,40 
     Q90,41 100,40 
     Q110,42 120,40 
     Q130,39 140,41 
     Q150,42 160,40 
     Q170,41 180,40 
     Q190,39 200,40 
     Q210,42 220,40 
     Q230,41 240,39 
     Q250,40 260,41 
     Q270,42 280,40 
     Q290,39 300,41 
     Q310,42 320,40 
     Q330,41 340,39 
     Q350,40 360,41 
     Q370,42 380,40 
     Q390,39 400,41 
     Q410,42 420,40 
     Q430,41 440,39 
     Q450,40 460,41 
     Q470,42 480,40 
     Q490,39 500,41 
     Q510,42 520,40 
     Q530,41 540,39 
     Q550,40 560,41 
     Q570,42 580,40 
     Q590,39 600,41 
     Q610,42 620,40 
     Q630,41 640,39 
     Q650,40 660,41 
     Q670,42 680,40 
     Q690,39 700,41 
     Q710,42 720,40 
     Q730,41 740,39 
     Q750,40 760,41 
     Q770,42 780,40 
     Q790,39 800,41 
     V80 H0 Z"
            />
          </svg>
        </div>
      </div>
      <footer className="bg-black text-white px-6 py-10 ">

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
    </>
  );
}

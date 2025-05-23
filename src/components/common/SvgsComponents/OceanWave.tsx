
interface IProps {
    flipY?: boolean
    color?: string
}
export default function OceanWave({ flipY = false, color = "#0A092D" }: IProps) {
    return (
        <div className={`h-[0.1px] ${flipY ? "-scale-y-100" : ""}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 80"
                className="w-full mb-1"
                style={{
                    filter: "drop-shadow( 0px 3px rgba(0, 0, 0, 0.4))",
                }}
            >
                <path
                    fill={color}
                    // fill="#0A092D"
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
        </div >
    )
}
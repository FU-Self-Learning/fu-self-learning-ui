import CardTopStudent from "./CardTopStudent";



export const teamMembers = [
    {
        name: "Sanjida Suli",
        role: "Marketing",
        image: "/images/team1.jpg",
    },
    {
        name: "Hossain Khan",
        role: "Developer",
        image: "/images/team2.jpg",

    },
    {
        name: "Oluwaseun",
        role: "Solution Mean",
        image: "/images/team1.jpg",

    },
    {
        name: "Suprika Sharika",
        role: "CEO-Founder",
        image: "/images/team2.jpg",

    },
];


const TopStudentPage = () => {
    return (
        <section
            className="w-full bg-gradient-to-br from-pink-100 to-orange-100 py-12 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/team.jpg')" }}
        >
            <div className="text-center mb-10">
                <div className="flex items-center justify-center group hover:-translate-y-1 transition-transform duration-200">
                    <span className="h-px w-6 bg-orange-500 mr-3 transition-all duration-200 group-hover:scale-110"></span>
                    <p className="uppercase text-sm text-orange-500 tracking-wide font-semibold">
                        Best of the Best
                    </p>
                    <span className="h-px w-6 bg-orange-500 ml-3 transition-all duration-200 group-hover:scale-110"></span>
                </div>

                <h2 className="text-4xl font-bold text-gray-800 mt-2">
                    Outstanding Students <br />
                    <span className="text-black">Top Student</span>
                </h2>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 ">
                {teamMembers.map((member) => (
                    <CardTopStudent
                        key={member.name}
                        name={member.name}
                        role={member.role}
                        image={member.image}
                    />
                ))}
            </div>
        </section>
    );
};

export default TopStudentPage;

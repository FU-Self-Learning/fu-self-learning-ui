import TopThree from './cardProduct/cardProduct';
import LeaderboardTable from './Table';

export const ProductSelectionPage = () => {
    return (
        <div className=" bg-[#0A092D] text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-4">🏆 Leaderboard</h1>
            <div className="flex justify-center mb-4">
                <div className="bg-[#232338] rounded-full p-1 inline-flex space-x-2">
                    <button className="px-4 py-1 bg-white text-black rounded-full">Daily</button>
                    <button className="px-4 py-1 text-white">Monthly</button>
                </div>
            </div>
            <TopThree />
            <LeaderboardTable />
        </div>
    );
}



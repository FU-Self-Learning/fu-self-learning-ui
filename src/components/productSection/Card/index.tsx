import { TrophyOutlined } from '@ant-design/icons';

const topUsers = [
    {
        name: 'Brian Ngo',
        points: 2000,
        prize: 50000,
        rank: 2,
        avatar: '/avatar1.png',
        color: 'bg-gray-600',
    },
    {
        name: 'Jolie Joie',
        points: 2000,
        prize: 100000,
        rank: 1,
        avatar: '/avatar2.png',
        color: 'bg-yellow-500',
    },
    {
        name: 'David Do',
        points: 2000,
        prize: 20000,
        rank: 3,
        avatar: '/avatar3.png',
        color: 'bg-orange-400',
    },
];

export default function TopThree() {
    return (
        <div className="flex justify-center items-end gap-4 mt-10">
            {topUsers
                .sort((a, b) => a.rank - b.rank)
                .map((user) => (
                    <div
                        key={user.rank}
                        className={`rounded-xl text-center px-6 py-4 w-52 shadow-md ${user.rank === 1 ? 'scale-110' : 'scale-100'} bg-[#1e1e2f]`}
                    >
                        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-2" />
                        <h3 className="text-white text-lg font-semibold">{user.name}</h3>
                        <div className="flex justify-center items-center text-white gap-1 mt-2">
                            <TrophyOutlined className="text-xl" />
                            <span>Earn {user.points} points</span>
                        </div>
                        <div className="text-cyan-300 text-lg font-bold mt-2">{user.prize.toLocaleString()} 💎</div>
                    </div>
                ))}
        </div>
    );
}

// components/LeaderboardTable.tsx
import { Table } from 'antd';

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
    },
    {
        title: 'User name',
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => (
            <div className="flex items-center gap-2">
                <img src={record.avatar} className="w-8 h-8 rounded-full" />
                <span>{text}</span>
            </div>
        ),
    },
    {
        title: 'Followers',
        dataIndex: 'followers',
        key: 'followers',
    },
    {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
    },
    {
        title: 'Reward',
        dataIndex: 'reward',
        key: 'reward',
        render: (value) => <span className="text-cyan-300 font-semibold">{value} 💎</span>,
    },
];

const data = [
    {
        key: '1',
        rank: 4,
        username: 'Henrietta O\'Connell',
        avatar: '/avatar4.png',
        followers: 12241,
        points: 2114424,
        reward: 1000,
    },
    {
        key: '2',
        rank: 5,
        username: 'Darrel Bins',
        avatar: '/avatar5.png',
        followers: 12241,
        points: 2114424,
        reward: 1000,
    },
];

export default function LeaderboardTable() {
    return <Table columns={columns} dataSource={data} pagination={false} className="bg-[#1e1e2f] text-white rounded-xl mt-8" />;
}

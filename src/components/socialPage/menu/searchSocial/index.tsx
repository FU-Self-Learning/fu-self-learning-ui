import React from 'react';
import { Input, Avatar, Button, Card, Typography, Spin, message } from 'antd';
import { CloseCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useUsersSocial } from '@/hooks/user/useUsersSocial';
import { useFollow } from '@/hooks/follow/useFollow';
import { useFollowers } from '@/hooks/follow/useFollowers';
import { useUnfollow } from '@/hooks/follow/useUnfollow';
import { isValidWebUrl } from '@/utils/urlValidation';

interface SearchSocialPageProps {
  handleCloseSearch: () => void;
}

const SearchSocialPage = ({ handleCloseSearch }: SearchSocialPageProps) => {
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersFetchError,
  } = useUsersSocial();

  // State for search input
  const [searchValue, setSearchValue] = React.useState('');
  const { mutate: follow } = useFollow();
  const {
    data: followers,
    isLoading: followersLoading,
    isError: followersError,
    error: followersFetchError,
  } = useFollowers();
  const { mutate: unfollow } = useUnfollow();

  // Track loading state for each specific user
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: number]: { follow: boolean; unfollow: boolean };
  }>({});

  React.useEffect(() => {
    if (usersError) {
      message.error('Failed to load users: ' + usersFetchError?.message);
    }
    if (followersError) {
      message.error('Failed to load followers: ' + followersFetchError?.message);
    }
  }, [usersError, usersFetchError, followersError, followersFetchError]);

  const handleFollow = (id: number) => {
    // Set loading state for this specific user
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], follow: true },
    }));

    follow(id, {
      onSuccess: () => {
        // Clear loading state on success
        setLoadingStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], follow: false },
        }));
      },
      onError: () => {
        // Clear loading state on error
        setLoadingStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], follow: false },
        }));
      },
    });
  };

  const handleUnfollow = (id: number) => {
    // Set loading state for this specific user
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], unfollow: true },
    }));

    unfollow(id, {
      onSuccess: () => {
        // Clear loading state on success
        setLoadingStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], unfollow: false },
        }));
      },
      onError: () => {
        // Clear loading state on error
        setLoadingStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], unfollow: false },
        }));
      },
    });
  };


  // Create a set of follower IDs for quick lookup
  const followedUserIds = new Set(followers?.map((f) => f.followingUser.id));

  // Filter users by search value
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!searchValue.trim()) return users;
    const lower = searchValue.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower)
    );
  }, [users, searchValue]);

  if (usersLoading || followersLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Spin size='large' />
      </div>
    );
  }

  if (usersError || followersError) {
    return <div className='text-red-500'>Error loading data.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className='w-96 bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-2rem)] overflow-y-auto'
    >
      <div className='mb-6'>
        <div className='flex flex-row justify-between items-center  !h-full '>
          <Typography.Title level={4} className=' !text-center !text-gray-800 !text-2xl !font-bold'>
            Search
          </Typography.Title>
          <CloseCircleOutlined className='text-3xl !text-black' onClick={handleCloseSearch} />
        </div>
        <Input
          size='large'
          placeholder='Search users...'
          prefix={<SearchOutlined className='text-gray-400' />}
          className='!rounded-xl !border-gray-200 hover:!border-blue-400 focus:!border-blue-400 !shadow-sm'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          allowClear
        />
      </div>

      <div className='space-y-4'>
        {filteredUsers.length === 0 ? (
          <div className='text-center text-gray-400'>No users found.</div>
        ) : (
          filteredUsers.map((item, index) => {
            const isCurrentlyFollowing = followedUserIds.has(item.id);
            const userLoadingState = loadingStates[Number(item.id)] || {
              follow: false,
              unfollow: false,
            };

            return (
              <Card
                styles={{ body: { padding: 10 } }}
                key={index}
                className='!rounded-xl hover:!shadow-md transition-all hover:scale-[1.02] cursor-pointer !mb-2'
              >
                <div className='flex items-center gap-4'>
                  <Avatar
                    size={48}
                    src={isValidWebUrl(item.avatarUrl) ? item.avatarUrl : undefined}
                    icon={<UserOutlined />}
                    className='!flex !items-center !justify-center'
                  />
                  <div className='flex-1 min-w-0'>
                    <Typography.Text strong className='block text-gray-800 text-lg truncate'>
                      {item.username}
                    </Typography.Text>
                    <Typography.Text className='text-sm text-gray-500 block'>
                      {item.email}
                    </Typography.Text>
                  </div>
                  {isCurrentlyFollowing ? (
                    <Button
                      type='default'
                      danger
                      className='!rounded-full !px-4'
                      onClick={() => handleUnfollow(Number(item.id))}
                      loading={userLoadingState.unfollow}
                    >
                      UnFollow
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      className='!bg-blue-500 hover:!bg-blue-600 !rounded-full !px-4'
                      onClick={() => handleFollow(Number(item.id))}
                      loading={userLoadingState.follow}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default SearchSocialPage;

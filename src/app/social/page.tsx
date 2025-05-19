import { NextPage } from 'next';
import Menu from "@/components/menu";
import ListFollowingPage from '@/components/menu/listFollowing';


type TProps = {
    children: React.ReactNode;
}
const SocialPage: NextPage<TProps> = ({ children }) => {
    return (
        <div className='flex justify-between mt-4'>
            <Menu></Menu>
            {children}
            <ListFollowingPage />
        </div>
    )
}

//F5F4EA

export default SocialPage;
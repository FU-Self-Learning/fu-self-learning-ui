import Menu from "@/components/socialPage/menu";
import ListFollowingPage from '@/components/socialPage/menu/listFollowing';


type TProps = {
    children: React.ReactNode;
}
const SocialLayout = ({ children }: TProps) => {
    return (
        <div className='flex justify-between mt-4' >
            <Menu></Menu>
            {children}
            <ListFollowingPage />
        </div >
    )
}

export default SocialLayout;
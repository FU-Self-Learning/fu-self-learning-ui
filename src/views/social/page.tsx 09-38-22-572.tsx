import React from 'react';
import { NextPage } from 'next';
import MenuPage from "@/components/menu";


type TProps = {}

const SocialPage: NextPage<TProps> = () => {
    return (
        <>
            <div className="relative w-full h-screen">
                <MenuPage />
            </div>
        </>
    )
}

export default SocialPage;

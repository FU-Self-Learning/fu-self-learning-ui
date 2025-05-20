
import { NextPage } from 'next';
import {
    CloseOutlined,
} from "@ant-design/icons";
import { Input } from "antd";

type TProps = {
    handleCloseSearch: () => void;
}

const SearchSocialPage: NextPage<TProps> = ({ handleCloseSearch }) => {
    return (
        <div className="bg-black text-white w-[calc(100vw - 250px)] w-[550px] p-4 z-40  rounded-tr-2xl">
            <div className="flex items-center justify-between mb-4">
                <Input
                    placeholder="Search"
                    className="bg-[#262626] text-white rounded-lg"
                    style={{ width: 'calc(100% - 30px)' }}
                />
                <CloseOutlined onClick={handleCloseSearch} style={{ color: 'white', cursor: 'pointer', marginLeft: 8 }} />
            </div>
            <div className="border-t border-gray-700 my-2"></div>
            <div>
                <h2 className="text-sm font-bold mb-2">Recent</h2>
            </div>
            <div className="flex h-screen justify-center items-center my-auto">
                <p className="text-gray-400 text-sm">There are no recent searches.</p>
            </div>
        </div>
    )
}

export default SearchSocialPage
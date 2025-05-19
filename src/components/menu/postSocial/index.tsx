"use client";

import React, { useState, useEffect } from "react";
import { Modal, Input, Upload, Button, Dropdown, MenuProps, Popconfirm } from "antd";
import { UploadOutlined, MoreOutlined, FileOutlined } from "@ant-design/icons";
import Group from "@p/svgs/Group.svg";


type Props = {
    open: boolean;
    onClose: () => void;
};

const { TextArea } = Input;

const filters = [
    { name: "None", style: "none" },
    { name: "Grayscale", style: "grayscale(100%)" },
    { name: "Sepia", style: "sepia(60%)" },
];

const CreatePostModal = ({ open, onClose }: Props) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [selectedFileUid, setSelectedFileUid] = useState<string | null>(null);
    const [filterStyle, setFilterStyle] = useState<string>("none");

    useEffect(() => {
        if (open) {
            setFilterStyle("none");
        }
    }, [open]);

    const isImage = (file: any) => file.type.startsWith("image/");

    const handleDiscard = () => {
        setFileList([]);
        setSelectedFileUid(null);
        setFilterStyle("none");
        onClose();
    };

    const items: MenuProps["items"] = [
        {
            key: "discard",
            label: fileList === null ? (
                <Popconfirm
                    title="Discard changes?"
                    description="Are you sure you want to discard this post?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={handleDiscard}
                >
                    <span className="cursor-pointer text-red-500">Discard changes</span>
                </Popconfirm>
            ) : (
                <span
                    className="cursor-pointer text-red-500"
                    onClick={handleDiscard}
                >
                    Discard changes
                </span>
            ),
        },
    ];
    ;

    const onFileChange = (info: any) => {
        setFileList(info.fileList);
    };

    const onSelectFile = (uid: string) => {
        setSelectedFileUid(uid);
        setFilterStyle("none"); // reset filter khi chọn file mới
    };

    const onFilterChange = (style: string) => {
        setFilterStyle(style);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={800}
            closable={false}
            className="rounded-xl"
        >
            <div className="flex gap-6 max-h-[500px]" style={{
                backgroundImage: `url(${Group})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }} >
                <div className="flex flex-col items-center justify-center w-1/3 h-1/3 border border-dashed rounded-lg p-4">
                    <Upload.Dragger
                        name="file"
                        multiple={true}
                        fileList={fileList}
                        onChange={onFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                        beforeUpload={() => false}
                        showUploadList={false}
                        className="w-full"
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="text-sm text-gray-500">
                            Drop image or file here or <span className="text-blue-500">browse</span>
                        </p>
                    </Upload.Dragger>
                </div>

                <div className="flex flex-col w-2/3 overflow-auto">
                    <label className="font-semibold mb-2">Uploaded Files or Image</label>


                    <div className="flex flex-wrap gap-3 max-h-[350px] overflow-auto">
                        {fileList.map((file) => (
                            <div
                                key={file.uid}
                                className={`relative cursor-pointer border rounded p-1 ${selectedFileUid === file.uid ? "border-blue-500" : "border-gray-300"
                                    }`}
                                style={{ width: isImage(file) ? 100 : "auto" }}
                                onClick={() => onSelectFile(file.uid)}
                            >
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn không cho kích hoạt onClick của div cha (chọn file)
                                        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                                        if (selectedFileUid === file.uid) {
                                            setSelectedFileUid(null);
                                            setFilterStyle("none");
                                        }
                                    }}
                                    className="absolute top-0 right-0 text-red-600 hover:text-red-800 cursor-pointer z-10"
                                    style={{ fontSize: 16, padding: "0 4px", backgroundColor: "white", borderRadius: "50%" }}
                                    title="Remove file"
                                >
                                    ×
                                </div>

                                {isImage(file) ? (
                                    <img
                                        src={URL.createObjectURL(file.originFileObj)}
                                        alt={file.name}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            filter: selectedFileUid === file.uid ? filterStyle : "none",
                                            borderRadius: 4,
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center gap-1 p-2">
                                        <FileOutlined style={{ fontSize: 32 }} />
                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {selectedFileUid && isImage(fileList.find((f) => f.uid === selectedFileUid)) && (
                        <div className="mt-4">
                            <label className="font-semibold">Filters</label>
                            <div className="flex gap-2 mt-1">
                                {filters.map((filter) => (
                                    <div
                                        key={filter.style}
                                        onClick={() => onFilterChange(filter.style)}
                                        className={`cursor-pointer border rounded overflow-hidden ${filterStyle === filter.style
                                            ? "border-blue-500"
                                            : "border-gray-300"
                                            }`}
                                        style={{ width: 70, height: 70 }}
                                        title={filter.name}
                                    >
                                        <img
                                            src={URL.createObjectURL(fileList.find((f) => f.uid === selectedFileUid)!.originFileObj)}
                                            alt={filter.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                filter: filter.style,
                                                transition: "filter 0.3s",
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <div>
                    <label className="font-semibold">Title</label>
                    <Input placeholder="Once upon a time..." maxLength={180} />
                </div>
                <div>
                    <label className="font-semibold">Description</label>
                    <TextArea rows={4} placeholder="The start of a wonderful story..." maxLength={360} />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                    <Button type="primary">Post</Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePostModal;

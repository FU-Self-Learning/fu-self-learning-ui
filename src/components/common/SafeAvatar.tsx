import React from 'react';
import { Avatar as AntdAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { isValidWebUrl } from '@/utils/urlValidation';
import type { AvatarProps } from 'antd';

interface SafeAvatarProps extends Omit<AvatarProps, 'src'> {
  src?: string | null;
}

/**
 * A safe Avatar component that validates URLs before using them.
 * Falls back to the UserOutlined icon if the URL is invalid or unsafe.
 */
const SafeAvatar: React.FC<SafeAvatarProps> = ({ src, icon, ...props }) => {
  const safeSrc = isValidWebUrl(src) ? src : undefined;
  const safeIcon = icon || <UserOutlined />;

  return <AntdAvatar {...props} src={safeSrc} icon={safeIcon} />;
};

export default SafeAvatar;

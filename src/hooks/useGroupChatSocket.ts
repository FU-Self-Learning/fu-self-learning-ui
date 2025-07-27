import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from '@/types/socket.type';

const GROUP_CHAT_NAMESPACE = '/group-chat';

export function useGroupChatSocket(
  userId: number,
  groupId?: number,
  onGroupMessage?: (msg: any) => void,
  onGroupMessageSent?: (msg: any) => void,
) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Dùng ref để giữ callback ổn định
  const onGroupMessageRef = useRef(onGroupMessage);
  const onGroupMessageSentRef = useRef(onGroupMessageSent);
  onGroupMessageRef.current = onGroupMessage;
  onGroupMessageSentRef.current = onGroupMessageSent;

  // Khởi tạo socket một lần theo userId
  useEffect(() => {
    if (!userId) return;
    if (socketRef.current) return; // Đã có socket, không tạo lại
    console.log('[Socket] Initializing group chat socket:', { userId });
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL_GROUP}${GROUP_CHAT_NAMESPACE}`, {
      query: { userId },
      transports: ['websocket'],
    });
    socketRef.current = socket;
    setIsConnected(false);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to group chat namespace');
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected (event)');
    });

    // Lắng nghe event nhận tin nhắn group
    socket.on('newGroupMessage', (msg: any) => {
      console.log('[Socket] Received newGroupMessage:', msg);
      if (onGroupMessageRef.current) onGroupMessageRef.current(msg);
    });
    socket.on('groupMessageSent', (msg: any) => {
      console.log('[Socket] Received groupMessageSent:', msg);
      if (onGroupMessageSentRef.current) onGroupMessageSentRef.current(msg);
    });

    return () => {
      // Cleanup khi unmount
      console.log('[Socket] Cleanup: removing socket listeners and disconnecting');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newGroupMessage');
      socket.off('groupMessageSent');
      if (socket.connected) {
        socket.disconnect();
        console.log('[Socket] Disconnected socket');
      }
      setIsConnected(false);
      socketRef.current = null;
    };
  }, [userId]);

  // Xử lý join/leave group khi groupId thay đổi
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;
    const groupIdNum = Number(groupId);
    let joinedGroupListener: ((data: any) => void) | null = null;
    if (!isNaN(groupIdNum)) {
      // Emit joinGroup khi đổi group
      console.log('[Socket] Emitting joinGroup:', { groupId: groupIdNum });
      socket.emit('joinGroup', { groupId: groupIdNum });
      // Chỉ emit loadGroupMessages sau khi nhận event joinedGroup từ server
      joinedGroupListener = (data: any) => {
        console.log('[Socket] joinedGroup', data);
        console.log('[Socket] Emitting loadGroupMessages:', { groupId: groupIdNum });
        socket.emit('loadGroupMessages', { groupId: groupIdNum });
      };
      socket.on('joinedGroup', joinedGroupListener);
    }
    // Cleanup khi groupId thay đổi: emit leaveGroup và remove listener
    return () => {
      if (!isNaN(groupIdNum)) {
        console.log('[Socket] Emitting leaveGroup:', { groupId: groupIdNum });
        socket.emit('leaveGroup', { groupId: groupIdNum });
        if (joinedGroupListener) {
          socket.off('joinedGroup', joinedGroupListener);
        }
      }
    };
  }, [groupId, isConnected]);

  // Trả về cả socket và trạng thái kết nối
  return { socket: socketRef.current, isConnected };
}

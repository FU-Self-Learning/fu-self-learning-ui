import { useEffect, useRef } from 'react';
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
  const isConnectedRef = useRef(false);

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
    isConnectedRef.current = false;

    socket.on('connect', () => {
      isConnectedRef.current = true;
      console.log('[Socket] Connected to group chat namespace');
    });
    socket.on('disconnect', () => {
      isConnectedRef.current = false;
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
      isConnectedRef.current = false;
      socketRef.current = null;
    };
  }, [userId]);

  // Xử lý join/leave group khi groupId thay đổi
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;
    const groupIdNum = Number(groupId);
    if (!isNaN(groupIdNum)) {
      // Nếu có groupId mới, emit joinGroup và loadGroupMessages
      console.log('[Socket] Emitting joinGroup:', { groupId: groupIdNum });
      socket.emit('joinGroup', { groupId: groupIdNum });
      console.log('[Socket] Emitting loadGroupMessages:', { groupId: groupIdNum });
      socket.emit('loadGroupMessages', { groupId: groupIdNum });
    }
    // Nếu cần, có thể emit leaveGroup cho group cũ (lưu groupId cũ bằng useRef nếu muốn)
    // ...
    // Cleanup khi groupId thay đổi: có thể emit leaveGroup ở đây nếu cần
    return () => {
      if (!isNaN(groupIdNum)) {
        console.log('[Socket] Emitting leaveGroup:', { groupId: groupIdNum });
        socket.emit('leaveGroup', { groupId: groupIdNum });
      }
    };
  }, [groupId]);

  // Trả về cả socket và trạng thái kết nối
  return { socket: socketRef.current, isConnected: isConnectedRef.current };
}

import io from "socket.io-client"; // dùng default import

type Socket = ReturnType<typeof io>;

export type { Socket };

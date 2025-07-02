import Script from "next/script";
import { motion } from "framer-motion";

export const ChatBoxAi = () => {
  return (
    <>
      <motion.div
        whileHover={{
          rotate: [0, -5, 5, -5, 5, 0],
          transition: { duration: 0.5, repeat: 0 },
        }}
        className="fixed bottom-1 right-1 z-50 cursor-pointer"
      >
        <Script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></Script>
        <df-messenger
          intent="WELCOME"
          chat-title="Support"
          agent-id="0e59920b-32ee-4091-8458-5fabb84f7ce2"
          language-code="vi"
        ></df-messenger>
      </motion.div>
    </>
  );
};

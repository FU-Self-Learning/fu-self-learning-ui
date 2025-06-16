import Script from "next/script"

export const ChatBoxAi = () => {
    return (<>
        <Script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></Script>
        <df-messenger
            intent="WELCOME"
            chat-title="Support"
            agent-id="0e59920b-32ee-4091-8458-5fabb84f7ce2"
            language-code="vi"
        ></df-messenger>
    </>

    )
}
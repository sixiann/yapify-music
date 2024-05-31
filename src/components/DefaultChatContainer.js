import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ChatContainer, MessageList } from "@chatscope/chat-ui-kit-react";

const DefaultChatContainer = () => {
  return (
    <ChatContainer>
      <MessageList key="2">
        <MessageList.Content
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            fontSize: "1.2em",
          }}
        >
          Click on a chat to start!
        </MessageList.Content>
      </MessageList>
    </ChatContainer>
  );
};

export default DefaultChatContainer;

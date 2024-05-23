import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  Sidebar,
  ChatContainer,
  Conversation,
  Search,
  MessageInput,
  Avatar,
  Message,
  MainContainer,
  ConversationList,
  ConversationHeader,
  MessageList,
  MessageSeparator,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function ChatsPage() {
  
  return (
    <>
    

    <div className = "p-7 pt-9">
    <div className="title-bar bg-blue-300">
            <button aria-label="Close" className="clos"></button>
            <h1 className="title">Yapify</h1>
            <button aria-label="Resize" disabled className="hidden"></button>
          </div>
    
      <MainContainer
        responsive
        style={{
            height: "500px",
            borderColor: "black",
            borderWidth: "1.5px",
        }}
      >
        
        <Sidebar position="left">
          <Search placeholder="Search..." />
          <ConversationList>
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Lilly"
              name="Lilly"
              
            >
              <Avatar
                name="Lilly"
                src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
                status="available"
              />
            </Conversation>
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Joe"
              name="Joe"
            >
              <Avatar
                name="Joe"
                src="https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"
                status="dnd"
              />
            </Conversation>
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader
          >
            
            <ConversationHeader.Back />
            
            <Avatar
              name="Zoe"
              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
            />
            <ConversationHeader.Content
              info="Active 10 mins ago"
              userName="Zoe"
            />
            <ConversationHeader.Actions></ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            <MessageSeparator content="Saturday, 30 November 2019" />
            <Message
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "single",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
               
            </Message>
            <Message
              avatarSpacer
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Patrik",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "normal",
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "normal",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            />

            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "last",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
          </MessageList>
          <MessageInput/>
        </ChatContainer>
      </MainContainer>
      </div>
      {/* <div className="lg:px-28 xl:px-60 container mx-auto flex flex-row justify-center">
        <div class="window w-2">
          <div class="title-bar">
            <button aria-label="Close" class="close"></button>
            <h1 class="title">Window With Stuff</h1>
            <button aria-label="Resize" class="resize"></button>
          </div>
          <div class="separator"></div>

          <div class="window-pane">heee</div>
        </div>{" "}
        <div className="window">
          <div className="title-bar bg-indigo-400">
            <button aria-label="Close" className="clos"></button>
            <h1 className="title">Yapify</h1>
            <button aria-label="Resize" disabled className="hidden"></button>
          </div>
          <div className="separator"></div>
          <div className=" window-pane flex flex-col justify-center text-center items-center">
            gdfgjljk
          </div>
          <div className="separator"></div>

          <div className=" window-pane flex flex-col justify-center text-center items-center">
            gdfgjljk
          </div>
        </div>
      </div> */}
    </>
  );
}

export default ChatsPage;

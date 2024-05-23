/* eslint-disable no-lone-blocks */
import React, { useState } from "react";
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
import { artists, user } from "./fakeData";

function ChatsPage() {
  const [activeArtist, setActiveArtist] = useState(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const handleConversationClick = (artist) => {
    setActiveArtist(artist);
    setCurrentMessageIndex(0);
    setDisplayedMessages([artists[artist].messages[0]]); // Initialize with the first incoming message
  };

  const handleUserChoice = (choice) => {
    setDisplayedMessages([...displayedMessages, choice]);
    setCurrentMessageIndex(currentMessageIndex + 1);
  };

  const renderUserChoices = () => {
    const displayedMessageSet = new Set(displayedMessages);
    const nextMessages = artists[activeArtist].messages.filter(
      (msg) => !displayedMessageSet.has(msg)
    );
    return (
      <div>
        <Message
          key={0}
          onClick={() => handleUserChoice(nextMessages[0])}
          model={{
            direction: "outgoing",
            message: `choice ${1}`,
            position: "single",
          }}
          style={{ cursor: 'pointer' }}

        >
          <Avatar
            name="me"
            src={
              "https://wallpapers.com/images/featured/blank-white-7sn5o1woonmklx1h.jpg"
            }
          />
        </Message>
        <Message
          key={0}
          onClick={() => handleUserChoice(nextMessages[0])}
          model={{
            direction: "outgoing",
            message: `choice ${2}`,
            position: "single",
          }}
          style={{ cursor: 'pointer' }}
        >
          <Avatar name="me" src={user.imageUrl} />
        </Message>
      </div>
    );
  };

  return (
    <>
      <div className="p-7 pt-9">
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
              {Object.keys(artists).map((artist, index) => (
                <Conversation
                  key={index}
                  info={`I'm #${index + 1}!!`}
                  lastSenderName={artist}
                  name={artist}
                  onClick={() => handleConversationClick(artist)}
                >
                  <Avatar
                    name={artist}
                    src={artists[artist].imageUrl}
                    status="available"
                  />
                </Conversation>
              ))}
            </ConversationList>
          </Sidebar>

          {activeArtist && (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back
                  // onClick={() => setActiveArtist(null)}
                />
                <Avatar
                  name={activeArtist}
                  src={artists[activeArtist].imageUrl}
                />
                <ConversationHeader.Content
                  info="online now..."
                  userName={activeArtist}
                />
                <ConversationHeader.Actions></ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList
                typingIndicator={
                  <TypingIndicator content={`${activeArtist} is typing`} />
                }
              >
                <MessageSeparator content="Saturday, 30 November 2019" />
                {displayedMessages.map((msg, index) => (
                  <Message
                    key={index}
                    model={{
                      direction: "incoming",
                      message: msg,
                      position: "single",
                    }}
                  >
                    <Avatar
                      name={activeArtist}
                      src={artists[activeArtist].imageUrl}
                    />
                  </Message>
                ))}
                {currentMessageIndex <
                  artists[activeArtist].messages.length - 1 &&
                  renderUserChoices()}
              </MessageList>
              <MessageInput />
            </ChatContainer>
          )}
        </MainContainer>
      </div>
    </>
  );
}

export default ChatsPage;

{
  /* <div className="lg:px-28 xl:px-60 container mx-auto flex flex-row justify-center">
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
      </div> */
}

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
import DefaultChatContainer from "../components/DefaultChatContainer";
import { artists, user } from "../fakeData";

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
          style={{ cursor: "pointer" }}
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
          style={{ cursor: "pointer" }}
        >
          <Avatar name="me" src={user.imageUrl} />
        </Message>
      </div>
    );
  };

  return (
    <>
      <div className="px-4 pt-2 container mx-auto ">
        <div className="title-bar bg-blue-300">
          <button aria-label="Close" className="clos"></button>
          <h1 className="title">Yapify</h1>
          <button aria-label="Resize" disabled className="hidden"></button>
        </div>

        <MainContainer
          responsive
          style={{
            height: "85vh",
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
                onClick={() => setActiveArtist(null)} //remember to change this to display for small screens
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

          {/* before user has clicked anything */}
          {!activeArtist && (
            <DefaultChatContainer />
          )}
        </MainContainer>
      </div>
    </>
  );
}

export default ChatsPage;
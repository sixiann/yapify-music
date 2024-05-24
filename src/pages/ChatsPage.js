/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
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
import { getCurrentArtists, getUserProfile, getThankYouText } from "../api";

function ChatsPage({ token }) {
  const [artists, setArtists] = useState([]); //artists in sidebar (<conversationlist>)
  const [activeArtist, setActiveArtist] = useState(null); //artist i'm chatting with
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  //load sidebar artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsData = await getCurrentArtists(token);
        setArtists(artistsData.data);
        const userData = await getUserProfile(token);
        setUser(userData.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchData();
  }, [token]);

  const handleConversationClick = async (artist) => {
    setActiveArtist(artist);
    if (!messages[artists[artist].artistId]) {
      setIsTyping(true);
      try {
        const response = await getThankYouText(artists[artist].artistId); // Call the getThankYouText function
        setMessages((prevMessages) => ({
          ...prevMessages,
          [artists[artist].artistId]: [
            ...(prevMessages[artists[artist].artistId] || []),
            {
              id: (prevMessages[artists[artist].artistId] || []).length,
              artist,
              message: response.data,
            },
          ],
        }));
      } catch (error) {
        console.error("Error getting thank you text:", error);
      } finally {
        setIsTyping(false);
      }
    }
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
                  lastSenderName={artists[index].artistName}
                  name={artists[index].artistName}
                  onClick={() => handleConversationClick(artist)}
                  style={{
                    backgroundColor:
                      activeArtist === artist ? "#c6e2f9" : "transparent",
                  }}
                >
                  <Avatar
                    name={artists[index].artistName}
                    src={artists[index].artistImage}
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
                  name={artists[activeArtist].artistName}
                  src={artists[activeArtist].artistImage}
                />
                <ConversationHeader.Content
                  info="online now..."
                  userName={artists[activeArtist].artistName}
                />
                <ConversationHeader.Actions></ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList
                typingIndicator={
                  isTyping && activeArtist ? (
                    <TypingIndicator
                      content={`${
                        artists.find(
                          (a) => a.artistId === artists[activeArtist].artistId
                        )?.artistName
                      } is typing`}
                    />
                  ) : null
                }
              >
                <MessageSeparator content="Saturday, 30 November 2019" />

                {activeArtist &&
                  messages[artists[activeArtist].artistId] &&
                  messages[artists[activeArtist].artistId].map((msg) => (
                    <Message
                      key={msg.id}
                      model={{
                        direction: "incoming",
                        message: msg.message,
                        position: "single",
                      }}
                    >
                      <Avatar
                        name={artists[msg.artist].artistName}
                        src={artists[msg.artist].artistImage}
                      />
                    </Message>
                  ))}
              </MessageList>
              <MessageInput />
            </ChatContainer>
          )}

          {/* before user has clicked anything */}
          {!activeArtist && <DefaultChatContainer />}
        </MainContainer>
      </div>
    </>
  );
}

export default ChatsPage;

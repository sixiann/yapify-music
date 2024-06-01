/* eslint-disable no-lone-blocks */
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import {
  getCurrentArtists,
  getUserProfile,
  getThankYouText,
  getCurrentDateTime,
  getRecommendationsText,
} from "../api";
import { waveform } from "ldrs";
waveform.register();

function ChatsPage({ token }) {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]); //artists in sidebar (<conversationlist>)
  const [activeArtist, setActiveArtist] = useState(null); //artist i'm chatting with
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState({});

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
  const isFirstRender = useRef(true);

  const handleBackClick = () => setSidebarVisible(!sidebarVisible);
  
  //load sidebar artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artistsData = await getCurrentArtists(token);
        setArtists(artistsData.data);
        const userData = await getUserProfile(token);
        setUser(userData.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (isFirstRender.current) {
      const isMobileScreen = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(isMobileScreen);
      if (isMobileScreen) {
        setSidebarVisible(true);
      }
      isFirstRender.current = false;
    }

    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%",
      });

      setConversationContentStyle({
        display: "flex",
      });

      setConversationAvatarStyle({
        marginRight: "1em",
      });

      setChatContainerStyle({
        display: "none",
      });
    } else {
      setSidebarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [
    sidebarVisible,
    setSidebarVisible,
    setConversationContentStyle,
    setConversationAvatarStyle,
    setSidebarStyle,
    setChatContainerStyle,
  ]);

  const handleConversationClick = useCallback(
    async (artist) => {
      if (sidebarVisible) {
        setSidebarVisible(false);
      }

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
          setInputValue("What are some other artists I can listen to?");
        } catch (error) {
          console.error("Error getting thank you text:", error);
        } finally {
          setIsTyping(false);
        }
      }
    },
    [
      sidebarVisible,
      setSidebarVisible,
      setActiveArtist,
      messages,
      artists,
      setIsTyping,
      setMessages,
    ]
  );

  const handleSend = async (artist) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [artists[artist].artistId]: [
        ...(prevMessages[artists[artist].artistId] || []),
        {
          id: (prevMessages[artists[artist].artistId] || []).length,
          direction: "outgoing",
          message: inputValue,
        },
      ],
    }));
    setInputValue("");
    setInputDisabled((prevInputDisabled) => ({
      ...prevInputDisabled,
      [artist]: true,
    }));
    setIsTyping(true);

    try {
      const response = await getRecommendationsText(artists[artist].artistId); // Call the getThankYouText function
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
  };
  return (
    <div className="px-4 pt-2 container mx-auto">
      {loading ? (
        <div className="flex justify-center items-center text-center h-[90vh]">
          <l-waveform
            size="100"
            stroke="3.5"
            speed="1"
            color="black"
          ></l-waveform>
        </div>
      ) : (
        <>
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
            <Sidebar position="left" style={sidebarStyle}>
              <Search placeholder="Search..." />

              <ConversationList>
                {Object.keys(artists).map((artist, index) => (
                  <Conversation
                    key={index}
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
                      style={conversationAvatarStyle}
                    />
                    <Conversation.Content
                      name={artists[index].artistName}
                      lastSenderName={artists[index].artistName}
                      info={`I'm #${index + 1}!!`}
                      style={conversationContentStyle}
                    />
                  </Conversation>
                ))}
              </ConversationList>
            </Sidebar>

            {activeArtist ? (
              <ChatContainer style={chatContainerStyle}>
                <ConversationHeader>
                  <ConversationHeader.Back
                    onClick={handleBackClick} //remember to change this to display for small screens
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
                  <MessageSeparator content={getCurrentDateTime()} />

                  {activeArtist &&
                    messages[artists[activeArtist].artistId] &&
                    messages[artists[activeArtist].artistId].map((msg) => (
                      <Message
                        key={msg.id}
                        model={{
                          direction: msg.direction || "incoming",
                          message: msg.message,
                          position: "single",
                        }}
                      >
                        <Avatar
                          name={
                            msg.direction === "outgoing"
                              ? user.userName
                              : artists[msg.artist].artistName
                          }
                          src={
                            msg.direction === "outgoing"
                              ? user.userImage
                              : artists[msg.artist].artistImage
                          }
                        />
                      </Message>
                    ))}
                </MessageList>
                <MessageInput
                  attachButton={false}
                  value={inputValue}
                  onSend={() => handleSend(activeArtist)}
                  disabled={inputDisabled[activeArtist]}
                  />
              </ChatContainer>
            ) : (
              !isMobile && <DefaultChatContainer />
            )}
          </MainContainer>
        </>
      )}
    </div>
  );
}

export default ChatsPage;

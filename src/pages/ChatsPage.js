/* eslint-disable no-lone-blocks */
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import ErrorPage from "./ErrorPage";
import Button from "../components/Button";
import {
  Sidebar,
  ChatContainer,
  Conversation,
  VoiceCallButton,
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
  getSongsPersonalityMessages,
} from "../api";
import { waveform } from "ldrs";
waveform.register();

function ChatsPage({ token, setToken }) {
  const [activeIndex, setactiveIndex] = useState(null); //artist i'm chatting with
  const [user, setUser] = useState({});

  const [artists, setArtists] = useState([]); //artists in sidebar (<conversationlist>)
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [inputDisabled, setInputDisabled] = useState({});
  const [sendDisabled, setSendDisabled] = useState({});

  //for how things look
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
  const isFirstRender = useRef(true);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };
  const handleBackClick = () => setSidebarVisible(!sidebarVisible);
  const updateStateVariable = (variable, index, value) => {
    variable((prevValue) => ({
      ...prevValue,
      [index]: value,
    }));
  };

  const updateMessages = useCallback((index, message, direction) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [artists[index].artistId]: [
        ...(prevMessages[artists[index].artistId] || []),
        {
          id: (prevMessages[artists[index].artistId] || []).length,
          direction: direction,
          index: index,
          message: message,
        },
      ],
    }));
  });


// If a request is made for an artist that is already in the pendingRequests set,
//  the function ignores the new request, 
//  preventing multiple concurrent requests for the same artist.
const pendingRequests = useRef(new Set()); 
const handleConversationClick = useCallback(
  async (index) => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }

    setactiveIndex(index);

    if (!messages[artists[index].artistId] && !pendingRequests.current.has(index)) {
      pendingRequests.current.add(index); 
      setIsTyping(true);

      try {
        const response = await getThankYouText(artists[index].artistId);
        updateMessages(index, response.data, "incoming");
        updateStateVariable(
          setInputValues,
          index,
          "What are some other artists I can listen to?"
        );
        updateStateVariable(setSendDisabled, index, false);
      } catch (error) {
        console.error("Error getting thank you text:", error);
        setError(true);
      } finally {
        pendingRequests.current.delete(index); // Remove the index from pending
        setIsTyping(false);
      }
    }
  },
  [sidebarVisible, messages, artists, updateMessages]
);


  const handleFBIClick = useCallback(
    async (index) => {
      if (sidebarVisible) {
        setSidebarVisible(false);
      }

      setactiveIndex(index);
      if (!messages[artists[index].artistId]) {
        setIsTyping(true);
        try {
          const response = await getSongsPersonalityMessages(
            artists[index].artistId
          );
          updateMessages(index, response.data, "incoming");
        } catch (error) {
          console.error("Error getting songs personality text:", error);
          setError(true);
        } finally {
          setIsTyping(false);
        }
      }
    },
    [sidebarVisible, messages, artists, updateMessages]
  );

  const handleSend = async (index) => {
    updateMessages(index, inputValues[index], "outgoing");
    updateStateVariable(setInputValues, index, "");
    updateStateVariable(setInputDisabled, index, true);
    setIsTyping(true);

    try {
      const response = await getRecommendationsText(artists[index].artistId);
      updateMessages(index, response.data, "incoming");
    } catch (error) {
      console.error("Error getting recommendations text:", error);
      setError(true);
    } finally {
      setIsTyping(false);
    }
  };

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
        setError(true);
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

  if (error) {
    return <ErrorPage logout = {logout}/>; 
  }

  return (
    <><div className="w-full flex">
      <Button
        className="ml-auto mt-2 mr-7 mb-1"
        onClick={logout}
        text="Logout" />
    </div><div className="px-4 pt-2 container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center text-center h-[90vh]">
            <l-waveform
              size="100"
              stroke="3.5"
              speed="1"
              color="#48a8f7"
            ></l-waveform>
          </div>
        ) : (
          <>
            <div className="block mt-0 p-0 fixed relative">
              <MainContainer
                responsive
                style={{
                  height: "85vh",
                }}
              >
                <Sidebar position="left" style={sidebarStyle}>
                  <ConversationHeader>
                    <ConversationHeader.Content userName="Your listening habits" />
                  </ConversationHeader>
                  <Conversation
                    key={0}
                    onClick={() => handleFBIClick("0")}
                    style={{
                      backgroundColor: activeIndex === "0" ? "#c6e2f9" : "transparent",
                    }}
                  >
                    <Avatar
                      src={artists[0].artistImage}
                      status="available"
                      style={conversationAvatarStyle} />
                    <Conversation.Content
                      name={artists[0].artistName}
                      info="I'm always watching you..."
                      style={conversationContentStyle} />
                  </Conversation>
                  <ConversationHeader>
                    <ConversationHeader.Content userName="Your top artists" />
                  </ConversationHeader>

                  <ConversationList>
                    {Object.keys(artists).map(
                      (_, index) =>
                        // Only render if index > 0
                        index > 0 && (
                          <Conversation
                            key={index}
                            onClick={() => handleConversationClick(index)}
                            style={{
                              backgroundColor: activeIndex === index
                                ? "#c6e2f9"
                                : "transparent",
                            }}
                          >
                            <Avatar
                              name={artists[index].artistName}
                              src={artists[index].artistImage}
                              status="available"
                              style={conversationAvatarStyle} />
                            <Conversation.Content
                              name={artists[index].artistName}
                              lastSenderName={artists[index].artistName}
                              info={`I'm #${index + 1}!!`}
                              style={conversationContentStyle} />
                          </Conversation>
                        )
                    )}
                  </ConversationList>
                </Sidebar>

                {activeIndex ? (
                  <ChatContainer style={chatContainerStyle}>
                    <ConversationHeader>
                      <ConversationHeader.Back onClick={handleBackClick} />
                      <Avatar
                        name={artists[activeIndex].artistName}
                        src={artists[activeIndex].artistImage} />
                      <ConversationHeader.Content
                        info="online now..."
                        userName={artists[activeIndex].artistName} />
                      <ConversationHeader.Actions>
                        <a
                          target="_blank"
                          href={artists[activeIndex].artistLink}
                          rel="noreferrer"
                        >
                          <VoiceCallButton title="Go to Spotify Link" />
                        </a>
                      </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList
                      typingIndicator={isTyping && activeIndex ? (
                        <TypingIndicator
                          content={`${artists[activeIndex].artistName} is typing`} />
                      ) : null}
                    >
                      <MessageSeparator content={getCurrentDateTime()} />

                      {activeIndex &&
                        messages[artists[activeIndex].artistId] &&
                        messages[artists[activeIndex].artistId].map((msg) => (
                          <Message
                            key={msg.id}
                            model={{
                              direction: msg.direction,
                              message: msg.message,
                              position: "single",
                            }}
                          >
                            <Avatar
                              name={msg.direction === "outgoing"
                                ? user.userName
                                : artists[msg.index].artistName}
                              src={msg.direction === "outgoing"
                                ? user.userImage
                                : artists[msg.index].artistImage} />
                          </Message>
                        ))}
                    </MessageList>
                    <MessageInput
                      attachButton={false}
                      value={inputValues[activeIndex] || ""}
                      onSend={() => handleSend(activeIndex)}
                      disabled={activeIndex === "0" ? true : inputDisabled[activeIndex]}
                      sendDisabled={activeIndex === "0" ? true : sendDisabled[activeIndex]} />
                  </ChatContainer>
                ) : (
                  !isMobile && <DefaultChatContainer />
                )}
              </MainContainer>
            </div>
          </>
        )}
      </div></>
  );
}

export default ChatsPage;

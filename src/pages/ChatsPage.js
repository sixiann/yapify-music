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
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]); //artists in sidebar (<conversationlist>)
  const [activeArtist, setActiveArtist] = useState(null); //artist i'm chatting with
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [inputDisabled, setInputDisabled] = useState({});
  const [sendDisabled, setSendDisabled] = useState({});
  const [error, setError] = useState(false);

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
  const updateStateVariable = (variable, artist, value) => {
    variable((prevValue) => ({
      ...prevValue,
      [artist]: value,
    }));
  };

  const updateMessages = useCallback((artist, message, direction) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [artists[artist].artistId]: [
        ...(prevMessages[artists[artist].artistId] || []),
        {
          id: (prevMessages[artists[artist].artistId] || []).length,
          direction: direction,
          artist: artist,
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
  async (artist) => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }

    setActiveArtist(artist);

    if (!messages[artists[artist].artistId] && !pendingRequests.current.has(artist)) {
      pendingRequests.current.add(artist); 
      setIsTyping(true);

      try {
        const response = await getThankYouText(artists[artist].artistId);
        updateMessages(artist, response.data, "incoming");
        updateStateVariable(
          setInputValues,
          artist,
          "What are some other artists I can listen to?"
        );
        updateStateVariable(setSendDisabled, artist, false);
      } catch (error) {
        console.error("Error getting thank you text:", error);
        setError(true);
      } finally {
        pendingRequests.current.delete(artist); // Remove the artist from pending
        setIsTyping(false);
      }
    }
  },
  [sidebarVisible, messages, artists, updateMessages]
);


  const handleFBIClick = useCallback(
    async (artist) => {
      if (sidebarVisible) {
        setSidebarVisible(false);
      }

      setActiveArtist(artist);
      if (!messages[artists[artist].artistId]) {
        setIsTyping(true);
        try {
          const response = await getSongsPersonalityMessages(
            artists[artist].artistId
          );
          updateMessages(artist, response.data, "incoming");
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

  const handleSend = async (artist) => {
    updateMessages(artist, inputValues[artist], "outgoing");
    updateStateVariable(setInputValues, artist, "");
    updateStateVariable(setInputDisabled, artist, true);
    setIsTyping(true);

    try {
      const response = await getRecommendationsText(artists[artist].artistId);
      updateMessages(artist, response.data, "incoming");
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
                      backgroundColor: activeArtist === "0" ? "#c6e2f9" : "transparent",
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
                      (artist, index) =>
                        // Only render if index > 0
                        index > 0 && (
                          <Conversation
                            key={index}
                            onClick={() => handleConversationClick(artist)}
                            style={{
                              backgroundColor: activeArtist === artist
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

                {activeArtist ? (
                  <ChatContainer style={chatContainerStyle}>
                    <ConversationHeader>
                      <ConversationHeader.Back onClick={handleBackClick} />
                      <Avatar
                        name={artists[activeArtist].artistName}
                        src={artists[activeArtist].artistImage} />
                      <ConversationHeader.Content
                        info="online now..."
                        userName={artists[activeArtist].artistName} />
                      <ConversationHeader.Actions>
                        <a
                          target="_blank"
                          href={artists[activeArtist].artistLink}
                          rel="noreferrer"
                        >
                          <VoiceCallButton title="Go to Spotify Link" />
                        </a>
                      </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList
                      typingIndicator={isTyping && activeArtist ? (
                        <TypingIndicator
                          content={`${artists.find(
                            (a) => a.artistId === artists[activeArtist].artistId
                          )?.artistName} is typing`} />
                      ) : null}
                    >
                      <MessageSeparator content={getCurrentDateTime()} />

                      {activeArtist &&
                        messages[artists[activeArtist].artistId] &&
                        messages[artists[activeArtist].artistId].map((msg) => (
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
                                : artists[msg.artist].artistName}
                              src={msg.direction === "outgoing"
                                ? user.userImage
                                : artists[msg.artist].artistImage} />
                          </Message>
                        ))}
                    </MessageList>
                    <MessageInput
                      attachButton={false}
                      value={inputValues[activeArtist] || ""}
                      onSend={() => handleSend(activeArtist)}
                      disabled={activeArtist === "0" ? true : inputDisabled[activeArtist]}
                      sendDisabled={activeArtist === "0" ? true : sendDisabled[activeArtist]} />
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

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
  const recommendationsQuestion =
    "What are some other artists I can listen to?";
  const [user, setUser] = useState({});
  const [artists, setArtists] = useState([]); //keeps track of all chat states associated with specific artist + artist information 
  const [activeIndex, setactiveIndex] = useState(null); //show the artist i'm chatting with in chatcontainer

  //more general states for how things look, responsiveness
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
  const isFirstRender = useRef(true);

  //queue of requests
  // If a request is made for an artist that is already in the pendingRequests set,
  //  the function ignores the new request,
  //  preventing multiple concurrent requests for the same artist.
  const pendingRequests = useRef(new Set());

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  //back click from chatcontainer to sidebar, only shows on small screens
  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  //----------- functions for updating the states that hold content in chat container ----------------//
  const updateMessages = useCallback((index, message, direction) => {
    setArtists((prevArtists) => ({
      ...prevArtists,
      [index]: {
        ...prevArtists[index],
        messages: [
          ...(prevArtists[index].messages || []),
          {
            id: (prevArtists[index].messages || []).length,
            direction: direction,
            message: message,
            index: index,
          },
        ],
      },
    }));
  });

  const updateArtistState = (index, newState) => {
    setArtists((prevArtists) => ({
      ...prevArtists,
      [index]: {
        ...prevArtists[index],
        ...newState,
      },
    }));
  };
  //------------------------------------------------------------------------------------------------//

  //----------------------functions for sending request to backend to get new content-------------------//
  const handleConversationClick = useCallback(
    async (index) => {
      if (sidebarVisible) {
        setSidebarVisible(false);
      }
      setactiveIndex(index);
      if (
        (!artists[index].messages || !artists[index].messages.length) &&
        !pendingRequests.current.has(index)
      ) {
        pendingRequests.current.add(index);
        updateArtistState(index, { isTyping: true });

        try {
          const response = await getThankYouText(artists[index].artistId);
          updateMessages(index, response.data, "incoming");
        } catch (error) {
          console.error("Error getting thank you text:", error);
          setError(true);
        } finally {
          updateArtistState(index, {
            inputValue: recommendationsQuestion,
          });
          updateArtistState(index, { sendDisabled: false });
          updateArtistState(index, { isTyping: false });
          pendingRequests.current.delete(index); // Remove the index from pending
        }
      }
    },
    [sidebarVisible, artists, updateMessages]
  );

  const handleFBIClick = useCallback(
    async (index) => {
      if (sidebarVisible) {
        setSidebarVisible(false);
      }

      setactiveIndex(index);
      if (
        (!artists[index].messages || !artists[index].messages.length) &&
        !pendingRequests.current.has(index)
      ) {
        pendingRequests.current.add(index);
        updateArtistState(index, { isTyping: true });
        try {
          const response = await getSongsPersonalityMessages(
            artists[index].artistId
          );
          updateMessages(index, response.data, "incoming");
        } catch (error) {
          console.error("Error getting songs personality text:", error);
          setError(true);
        } finally {
          updateArtistState(index, { isTyping: false });
        }
      }
    },
    [sidebarVisible, artists, updateMessages]
  );

  const handleSend = async (index) => {
    updateMessages(index, recommendationsQuestion, "outgoing");
    updateArtistState(index, { inputValue: "" });
    updateArtistState(index, { sendDisabled: true });
    updateArtistState(index, { inputDisabled: true });
    updateArtistState(index, { isTyping: true });

    try {
      const response = await getRecommendationsText(artists[index].artistId);
      updateMessages(index, response.data, "incoming");
    } catch (error) {
      console.error("Error getting recommendations text:", error);
      setError(true);
    } finally {
      updateArtistState(index, { isTyping: false });
    }
  };

  //------------------------------------------------------------------------------------------------//

  //on load, get user's current top artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artistsData = await getCurrentArtists(token);
        setArtists(artistsData.data);

        setArtists((prevArtists) => {
          const updatedArtists = { ...prevArtists };
          Object.keys(updatedArtists).forEach((index) => {
            updatedArtists[index] = {
              ...updatedArtists[index],
              messages: [],
              isTyping: false,
              inputValue: "",
              inputDisabled: true,
              sendDisabled: true,
            };
          });
          return updatedArtists;
        });

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

  //function for mobile responsiveness, toggling between sidebar and chatcontainer
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

  //show error screen if something goes wrong
  if (error) {
    return <ErrorPage logout={logout} />;
  }

  return (
    <>
      <div className="h-screen">
        <div className="w-full flex">
          <Button
            className="ml-auto mt-2 mr-7 mb-1"
            onClick={logout}
            text="Logout"
          />
        </div>
        <div className="px-4 pt-2 container mx-auto">
          {loading ? (
            //loading screen with the lil waveform
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
                  {/* left sidebar that shows the artists */}
                  <Sidebar position="left" style={sidebarStyle}>
                    <ConversationHeader>
                      <ConversationHeader.Content userName="Your listening habits" />
                    </ConversationHeader>
                    <Conversation
                      key={0}
                      onClick={() => handleFBIClick("0")}
                      style={{
                        backgroundColor:
                          activeIndex === "0" ? "#c6e2f9" : "transparent",
                      }}
                    >
                      <Avatar
                        src={artists[0].artistImage}
                        status="available"
                        style={conversationAvatarStyle}
                      />
                      <Conversation.Content
                        name={artists[0].artistName}
                        info="I'm always watching you..."
                        style={conversationContentStyle}
                      />
                    </Conversation>
                    <ConversationHeader>
                      <ConversationHeader.Content userName="Your top artists" />
                    </ConversationHeader>

                    <ConversationList>
                      {Object.keys(artists).map(
                        (_, index) =>
                          index > 0 && (
                            <Conversation
                              key={index}
                              onClick={() => handleConversationClick(index)}
                              style={{
                                backgroundColor:
                                  activeIndex === index
                                    ? "#c6e2f9"
                                    : "transparent",
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
                          )
                      )}
                    </ConversationList>
                  </Sidebar>

                  {/* right chatcontainer that shows the actual chat */}
                  {activeIndex ? (
                    <ChatContainer style={chatContainerStyle}>
                      <ConversationHeader>
                        <ConversationHeader.Back onClick={handleBackClick} />
                        <Avatar
                          name={artists[activeIndex].artistName}
                          src={artists[activeIndex].artistImage}
                        />
                        <ConversationHeader.Content
                          info="online now..."
                          userName={artists[activeIndex].artistName}
                        />
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
                        typingIndicator={
                          artists[activeIndex]?.isTyping ? (
                            <TypingIndicator
                              content={`${artists[activeIndex].artistName} is typing`}
                            />
                          ) : null
                        }
                      >
                        <MessageSeparator content={getCurrentDateTime()} />

                        {/* render messages in this chat */}
                        {activeIndex &&
                          artists[activeIndex].messages &&
                          artists[activeIndex].messages.map((msg) => (
                            <Message
                              key={msg.id}
                              model={{
                                direction: msg.direction,
                                message: msg.message,
                                position: "single",
                              }}
                            >
                              <Avatar
                                name={
                                  msg.direction === "outgoing"
                                    ? user.userName
                                    : artists[msg.index].artistName
                                }
                                src={
                                  msg.direction === "outgoing"
                                    ? user.userImage
                                    : artists[msg.index].artistImage
                                }
                              />
                            </Message>
                          ))}
                      </MessageList>
                      <MessageInput
                        attachButton={false}
                        value={artists[activeIndex].inputValue}
                        onSend={() => handleSend(activeIndex)}
                        disabled={artists[activeIndex].inputDisabledaa}
                        sendDisabled={artists[activeIndex].sendDisabled}
                      />
                    </ChatContainer>
                  ) : (
                    //when no conversation has been clicked yet
                    !isMobile && <DefaultChatContainer />
                  )}
                </MainContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatsPage;

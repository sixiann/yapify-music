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
import { getCurrentArtists } from "../api";
  
function ChatsPage({ token }) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentArtists(token); // Use your function to get data
        setArtists(data.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchData();
  }, []);

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


        </MainContainer>
      </div>
    </>
  );
}

export default ChatsPage;
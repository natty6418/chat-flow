import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Hash } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useAuth } from "../../hooks/useAuth";
import Room from "../../types/room";
import Message from "../../types/message";
import { useQuery, useMutation } from "@apollo/client";
import { getMessagesForRoom } from "../../graphql/queries";
import { createMessage } from "../../graphql/mutations";
import { awsConfig } from "../../config/aws-config";
import { onNewMessageInRoom } from "../../graphql/subscriptions";
import { print } from "graphql";

interface ChatInterfaceProps {
  room: Room;
  onBackToRooms: () => void;
}

export function ChatInterface({ room, onBackToRooms }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { user, idToken } = useAuth();
  const navigate = useNavigate();

  // Move these hook declarations up BEFORE any useEffect that references them
  const { loading: queryLoading, data: queryData } = useQuery<{
    getMessagesForRoom: Message[];
  }>(getMessagesForRoom, {
    variables: { roomId: room.id },
  });

  const [
    createMessageMutation,
    { loading: createMessageLoading, error: createMessageError },
  ] = useMutation(createMessage, {
    variables: {
      roomId: room.id,
      body: newMessage,
    },
    onCompleted: () => {
      // const message: Message = {
      //   id: Date.now().toString(),
      //   body: newMessage.trim(),
      //   from: user.username,
      //   createdAt: new Date().toISOString(),
      //   roomId: room.id,
      // };
      // setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setSending(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setSending(false);
    },
  });

  if (!room || !user) {
    return navigate("/", { replace: true });
  }

  // Replace useSubscription with direct WebSocket connection
  useEffect(() => {
    // ...existing code...
    const setupWebSocket = async () => {
      try {
        // Close existing socket if any
        if (
          socketRef.current &&
          (socketRef.current.readyState === WebSocket.OPEN ||
            socketRef.current.readyState === WebSocket.CONNECTING)
        ) {
          socketRef.current.close();
        }

        const HTTP_DOMAIN = new URL(awsConfig.API.GraphQL.endpoint).host;
        const REALTIME_DOMAIN = new URL(
          awsConfig.API.GraphQL.realTime.subscriptionEndpoint
        ).host;

        // Create auth object with token or API key
        const authorization = idToken
          ? { Authorization: `${idToken}`, host: HTTP_DOMAIN }
          : { "x-api-key": awsConfig.API.GraphQL.apiKey, host: HTTP_DOMAIN };

        // const authorization = {
        //   'x-api-key': awsConfig.API.GraphQL.apiKey,
        //   host: REALTIME_DOMAIN,
        // }

        // Get auth protocol
        const getAuthProtocol = () => {
          const header = btoa(JSON.stringify(authorization))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
          return `header-${header}`;
        };

        // Create subscription message
        const subscriptionMessage = {
          query: print(onNewMessageInRoom),
          variables: { roomId: room.id },
        };

        // Connect to WebSocket
        socketRef.current = await new Promise((resolve, reject) => {
          // ...existing code...
          const socket = new WebSocket(`wss://${REALTIME_DOMAIN}/graphql`, [
            "graphql-ws",
            getAuthProtocol(),
          ]);

          socket.onopen = () => {
            // ...existing code...
            // Send connection init message
            socket.send(
              JSON.stringify({ type: "connection_init", payload: {} })
            );
            resolve(socket);
          };

          socket.onclose = (event) => {
            console.error("WebSocket closed:", event.reason);
            reject(new Error(event.reason));
          };

          socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            reject(error);
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "error") {
              data.payload.errors.forEach((err: any) => {
                console.error("WebSocket error:", err.message);
              });
            }

            console.log("WebSocket message received:", data);

            // Handle connection_ack
            if (data.type === "connection_ack") {
              // ...existing code...
              // After connection is acknowledged, send subscription
              // socket.send(JSON.stringify({
              //   id: `sub-${room.id}`,
              //   type: 'subscribe',
              //   payload: subscriptionMessage
              // }));
              const opId = `sub-${room.id}`; // or uuid(), etc.

             
              socket.send(JSON.stringify({
                id: opId,
                type: 'start',
                payload: {
                  data: JSON.stringify(subscriptionMessage),
                  extensions: {
                    authorization: {
                      ...authorization,

                    }}
                }
              }));
            }

            // ...existing code...

            // Handle subscription data

            if (
              data.type === "data" &&
              data.payload?.data?.onNewMessageInRoom
            ) {
              const newMessage = data.payload.data.onNewMessageInRoom;
              // ...existing code...

              // Only add message if it's not from current user or is new
              setMessages((prev) => {
                // Check if message already exists
                if (!prev.some((msg) => msg.id === newMessage.id)) {
                  return [...prev, newMessage];
                }
                return prev;
              });
            }
          };
        });
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
      }
    };

    setupWebSocket();

    // Cleanup WebSocket on component unmount
    return () => {
      if (socketRef.current) {
        // ...existing code...
        socketRef.current.close();
      }
    };
  }, [room.id, idToken]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (createMessageError) {
      console.error("Error sending message:", createMessageError);
      setSending(false);
    }
    if (createMessageLoading) {
      setSending(true);
    }
  }, [createMessageLoading, createMessageError]);

  useEffect(() => {
    setLoading(queryLoading);
    if (queryData && queryData.getMessagesForRoom) {
      setMessages(queryData.getMessagesForRoom);
      setLoading(false);
    } else if (!queryLoading) {
      setMessages([]);
      setLoading(false);
    }
  }, [queryLoading, queryData]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);

    createMessageMutation({
      variables: {
        roomId: room.id,
        body: newMessage.trim(),
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwnMessage = (message: Message) => {
    return user && message.from === user.username;
  };

  return (
    <div className="flex-1 flex flex-col w-1/2 m-auto rounded-md shadow-black">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBackToRooms}
            className="md:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onBackToRooms}
          className="hidden md:flex"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspaces
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to {room.name}!
              </h3>
              <p className="text-gray-600">
                Start a conversation with your team
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage(message) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    isOwnMessage(message)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  {!isOwnMessage(message) && (
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {message.from}
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">{message.body}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage(message) ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={sendMessage}
            loading={sending}
            disabled={!newMessage.trim()}
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { type Message, type Chat } from "~/types";
import { useState, useEffect, useRef } from "react";
import { supabase } from "~/supabaseClient";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { isToday } from "~/helpers/isToday";

export default function ChatPage() {
  const router = useRouter();
  const chatID = Number(router.query.id);
  console.log(chatID);

  const {
    data: chat,
    isLoading,
    isError,
  } = api.chat.fetchChatById.useQuery(chatID, {
    retry: false,
  });

  return chat !== undefined && <ChatComponent chat={chat} />;
}

interface ChatComponentProps {
  chat: Chat;
}

const ChatComponent = (props: ChatComponentProps) => {
  const { chat } = props;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State to store messages
  const [messages, setMessages] = useState<Message[]>([]);
  // Fetch messages for a given chat id
  const {
    data: fetchedMessages,
    isLoading,
    isError,
    refetch,
  } = api.message.fetchMessages.useQuery(chat.id, {
    retry: false,
  });

  useEffect(() => {
    // When a change is detected, fetch messages again
    const handleInserts = () => {
      void refetch();
      // Update messages
      if (fetchedMessages !== undefined) {
        setMessages(fetchedMessages);
      }
    };
    // Subscribe to new messages
    supabase
      .channel("Message")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        handleInserts,
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      const unsubscribe = async () => {
        await supabase.channel("Message").unsubscribe();
      };
      void unsubscribe();
    };
  }, [fetchedMessages, isLoading, isError, messages, refetch]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [fetchedMessages]);

  return (
    <div className="flex flex-col h-full pt-5 gap-2">
      <div
        className="flex-grow overflow-y-scroll"
        ref={chatContainerRef}
      >
        {fetchedMessages?.map((message) => (
          <MessageBubble
            {...message}
            key={message.id}
          />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

const MessageBubble = (props: Message) => {
  const { id, text, readReceipts, user, created_at } = props;

  const currentUser = useUser();
  const fromOtherUser = currentUser.user?.id !== user.google_id;
  const bubbleColor = fromOtherUser
    ? "from-blue-600 via-blue-600 to-blue-500"
    : "from-cyan-600 via-cyan-500 to-cyan-500";
  const messageFromToday = isToday(new Date(created_at));
  return (
    <div
      className={`flex gap-2 items-start mx-10 ${
        !fromOtherUser && "justify-end"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          {fromOtherUser && (
            <img
              src={user.avatar_url ?? "https://via.placeholder.com/150"}
              alt={`Profile picture of ${user.first_name}`}
              className="w-10 h-10 rounded-full"
            />
          )}

          {fromOtherUser && <div className="ml-auto"></div>}

          <p
            key={id}
            className={`p-2 bg-gradient-to-b ${bubbleColor} rounded-md shadow-md shadow-blue-300 text-zinc-100 max-w-[400px]`}
          >
            {text}
          </p>
        </div>
        <p
          className={`flex w-full text-xs text-zinc-500 ${
            !fromOtherUser ? "justify-start" : "justify-end"
          }`}
        >
          {messageFromToday
            ? new Date(created_at).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date(created_at).toLocaleDateString("en-GB", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
        </p>
      </div>
    </div>
  );
};

const MessageInput = () => {
  const chatboxRef = useRef<HTMLTextAreaElement>(null);
  const [messageTooLong, setMessageTooLong] = useState(false);
  const { mutate: sendMessage, isLoading: sendingMessage } =
    api.message.sendMessage.useMutation();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    // Limit the length to 250 characters
    if (inputValue.length > 250) {
      setMessageTooLong(true);
      event.target.value = inputValue.substring(0, 250);
    } else {
      setMessageTooLong(false);
    }
  };

  // Send message and reset chatbox
  const handleSend = () => {
    if (chatboxRef.current) {
      sendMessage(chatboxRef.current.value);
      chatboxRef.current.value = "";
    }
  };

  useEffect(() => {
    //event listener to submit message on enter
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="flex items-end p-2 bg-white border-t">
      <div className="flex-col w-full">
        {messageTooLong && (
          <Label
            htmlFor="chatbox"
            className="text-red-500 bg-red-100 border-red-500"
          >
            Message too long...
          </Label>
        )}
        <Textarea
          id="chatbox"
          ref={chatboxRef}
          className={`flex-1 resize-none p-2 border border-gray-300 rounded focus:outline-none  ${
            messageTooLong && "border-red-500 bg-red-800"
          }}`}
          placeholder="Type a message (Max 250 chars)..."
          onChange={handleChange}
          rows={1}
        />
      </div>
      <Button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
        onClick={handleSend}
        disabled={sendingMessage || messageTooLong}
      >
        Send
      </Button>
    </div>
  );
};

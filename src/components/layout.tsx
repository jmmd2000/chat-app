/* eslint-disable @next/next/no-img-element */
import { use, type PropsWithChildren, useEffect } from "react";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { Chat } from "~/types";
import Link from "next/link";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="w-full">{props.children}</main>
    </div>
  );
};

const Sidebar = () => {
  const user = useUser();
  const { data, isLoading, isError } = api.chat.fetchChatByUser.useQuery(
    undefined,
    {
      retry: false,
    },
  );
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <nav className="bg-zinc-800 top-0 left-0 h-full w-60">
      <div>
        {data?.map((chat) => {
          return (
            <ChatCard
              chat={chat}
              key={chat.id}
            />
          );
        })}
      </div>
    </nav>
  );
};

interface ChatCardProps {
  chat: Chat;
}

const ChatCard = (props: ChatCardProps) => {
  const { chat } = props;
  const user = useUser();
  const otherUser = chat?.participants.find((participant) => {
    return participant.google_id !== user.user?.id;
  });
  return (
    <Link href={`/chat/${chat.id}`}>
      <div
        className="p-2 flex flex-row items-center gap-4"
        key={chat.id}
      >
        {otherUser && (
          <>
            <img
              src={otherUser.avatar_url ?? "https://via.placeholder.com/150"}
              alt={`Profile picture of ${otherUser.first_name}`}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-zinc-100 font-semibold text-lg">
                {otherUser.first_name ?? "Someone"}
              </p>
              <p className="text-ellipsis whitespace-nowrap overflow-hidden max-w-32 text-sm text-zinc-400">
                {chat.messages[chat.messages.length - 1]?.text}
              </p>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

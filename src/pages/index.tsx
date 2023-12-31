/* eslint-disable @next/next/no-img-element */
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { use, useEffect, useRef, useState } from "react";
import { supabase } from "~/supabaseClient";
import { type Message, type MessageEvent } from "~/types";

export default function Home() {
  const user = useUser();
  const {
    mutate: createUser,
    // isLoading: creatingUser,
    // isError: failedCreatingUser,
  } = api.user.create.useMutation();

  // const mutation = api.chat.create.useMutation();
  // useEffect(() => {
  //   void mutation.mutate("user_2aFCzaU3vpUQQOhRHrEQmkxru3L");
  // }, []);

  const { data } = api.user.getCurrent.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (user.isSignedIn && (data === undefined || data === null)) {
      console.log("creating user");
      createUser({
        first_name: user.user.firstName,
        last_name: user.user.lastName,
        avatar_url: user.user.imageUrl,
      });
    } else {
      return;
    }
  }, [user.isSignedIn, data]);

  return (
    <>
      {/* {!user.isSignedIn && (
        <SignInButton
          afterSignInUrl="/"
          afterSignUpUrl="/"
        >
          <button>Login</button>
        </SignInButton>
      )}
      {!!user.isSignedIn && (
        <SignOutButton>
          <button>Log Out</button>
        </SignOutButton>
      )} */}
    </>
  );
}

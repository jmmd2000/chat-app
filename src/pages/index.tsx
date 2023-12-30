import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const user = useUser();
  return (
    <>
      {!user.isSignedIn && (
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
      )}
    </>
  );
}

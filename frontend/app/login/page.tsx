import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">

      {/* Optional subtle glow for depth */}
      <div className="absolute w-[300px] h-[300px] bg-blue-400/20 blur-3xl rounded-full top-20 left-10" />
      <div className="absolute w-[300px] h-[300px] bg-purple-400/20 blur-3xl rounded-full bottom-20 right-10" />

      {/* LOGIN CARD */}
      <div className="glass-strong w-full max-w-md rounded-2xl p-8 relative z-10 shadow-2xl">


        <LoginClient />
      </div>
    </div>
  );
}
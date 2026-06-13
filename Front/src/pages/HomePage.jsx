import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useAppStore } from "../store/useAppStore";

export default function HomePage() {
  const { selectUser, users } = useAppStore();

  useEffect(() => {
    if (users.length > 0) {
      selectUser(users[0]);
    }
  }, [users, selectUser]);

  return (
    <div className="min-h-screen bg-abyss">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-ember/5 rounded-full blur-[200px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-ember/3 rounded-full blur-[150px] translate-y-1/2" />
      </div>

      <Sidebar />

      <main className="lg:ml-72 min-h-screen pt-16 flex flex-col">
        <ChatContainer />
      </main>
    </div>
  );
}
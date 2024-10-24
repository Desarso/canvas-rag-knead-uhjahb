import { ChatAppComponent } from "./components/chat-app";
import { Layout } from "./components/sidebar/layout";

function App() {
  return (
    <div className="flex">
      <div>
        <Layout />
      </div>
      <ChatAppComponent />
    </div>

);
}

export default App;

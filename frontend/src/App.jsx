import "./App.css";
import Home from "./pages/private/Home";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";

function App() {
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      {/* <Login /> */}
      {/* <Signup /> */}
      <Home />
    </div>
  );
}

export default App;

import Posts from "./pages/Posts";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Posts />} />
      </Routes>
    </Router>
  );
}
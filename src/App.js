import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from './FrontPage';
import DisplayDocument from "./DisplayDocument";
import CRUD from "./CRUD";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/document/:id" element={<DisplayDocument />} />
          <Route path="CRUD" element={<CRUD />} />
        </Routes>
    </Router>
  );
}

export default App;

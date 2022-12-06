import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeContainer from "./containers/Home";
import ErrorContainer from "./containers/Error";

function App() {
  return (
    <div className="h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeContainer />} />
          <Route path="error" element={<ErrorContainer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

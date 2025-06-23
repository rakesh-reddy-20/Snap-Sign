import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <div className="p-6">
        <div className="p-6 space-y-4">
          <p className="text-lg font-poppins">This is Poppins font</p>
          <p className="text-lg font-sans">
            This is default Tailwind sans font (usually Segoe or system-ui)
          </p>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

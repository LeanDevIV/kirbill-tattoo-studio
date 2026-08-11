import { BrowserRouter, Routes, Route } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-2xl">Kirbill Tattoo Studio</div>} />
      </Routes>
    </BrowserRouter>
  );
}

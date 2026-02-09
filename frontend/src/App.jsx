import { BrowserRouter, Routes, Route } from "react-router-dom"

import SignIn from "./signin"
import SignUp from "./signup"
import Home from "./Home"
import MainPage from "./MainPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main/*" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

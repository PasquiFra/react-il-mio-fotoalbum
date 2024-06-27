// import utils 
import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './contexts/AuthContext'

// import componenti
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import Login from "./components/Authentication/Login";
import { useAuth } from "./contexts/AuthContext";

function App() {


  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DefaultLayout />} >
            <Route index element={<HomePage />} />

            <Route path="login" element={<Login />} />

          </Route>


        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

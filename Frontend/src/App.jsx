// import utils 
import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

// import componenti
import DefaultLayout from "../layouts/DefaultLayout";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultLayout />} >
          <Route index element={<HomePage />} />

        </Route>


      </Routes>
    </>
  )
}

export default App

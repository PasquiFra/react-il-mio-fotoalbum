// import utils 
import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from "./contexts/AuthContext";
import SavePrevPage from './utils/SavePrevPage'

// import componenti
import DefaultLayout from "./layouts/DefaultLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserAuth from "./components/Authentication/UserAuth";
import CategoriesPage from "./pages/CategoriesPage";
import GalleryPage from "./pages/GalleryPage";
import ContactsPage from "./pages/ContactsPage";
import InboxPage from "./pages/InboxPage";
import AddPhotoPage from "./pages/AddPhotoPage";


function App() {


  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DefaultLayout />} >
            <Route index element={<HomePage />} />

            <Route path="login" element={<LoginPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="contacts" element={<ContactsPage />} />

          </Route>

          <Route path="/" element={
            <SavePrevPage>
              <UserAuth>
                <DefaultLayout />
              </UserAuth>
            </SavePrevPage>
          }>
            <Route path="categories" element={<CategoriesPage />} />

            <Route path="add-photo" element={<AddPhotoPage />} />
            <Route path="inbox" element={<InboxPage />} />

          </Route>

        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

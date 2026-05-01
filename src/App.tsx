import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import CookingTips from './pages/CookingTips';
import AboutUs from './pages/AboutUs';
import Login from './features/auth/components/LoginForm';
import Signup from './features/auth/components/SignupForm';
import NotFound from './pages/NotFound/NotFound'; 
import Layout from './shared/layout/Layout';
import { ContactPage } from './features/contact';
import ScrollRestoration from './shared/components/ScrollRestoration';
import ProfilePage from './features/profile/pages/Profilepage';
import { FavoritesProvider } from './features/profile';
import { AuthProvider } from './features/auth/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollRestoration />

          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="recipes/:id" element={<RecipeDetails />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="tips" element={<CookingTips />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
          </Routes>

        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;

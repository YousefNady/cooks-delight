import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './features/home/pages/Home';
import Recipes from './features/recipes/pages/Recipes';
import RecipeDetails from './features/recipe-details/pages/RecipeDetails';
import CookingTips from './features/cookingTips/pages/CookingTips';
import AboutUs from './features/aboutUs/pages/AboutUs';
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import NotFound from './shared/components/NotFound/NotFound'; 
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

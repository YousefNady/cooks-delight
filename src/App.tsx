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
import PageTitle from './shared/components/PageTitle/PageTitle';
import DashboardPageExample from "./features/dashboard/pages/DashboardPage.example";
import ComponentShowcase from "./features/dashboard/components/ComponentShowcase.example";


function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollRestoration />

            <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <PageTitle title="Home | Cooks Delight">
                  <Home />
                </PageTitle>
              } />
              
              <Route path="recipes" element={
                <PageTitle title="Recipes | Cooks Delight">
                  <Recipes />
                </PageTitle>
              } />
              
              <Route path="recipes/:id" element={
                <PageTitle title="Recipe Details | Cooks Delight">
                  <RecipeDetails />
                </PageTitle>
              } />
              
              <Route path="profile" element={
                <PageTitle title="My Profile | Cooks Delight">
                  <ProfilePage />
                </PageTitle>
              } />
              
              <Route path="tips" element={
                <PageTitle title="Cooking Tips | Cooks Delight">
                  <CookingTips />
                </PageTitle>
              } />
              
              <Route path="about" element={
                <PageTitle title="About Us | Cooks Delight">
                  <AboutUs />
                </PageTitle>
              } />
              
              <Route path="contact" element={
                <PageTitle title="Contact Us | Cooks Delight">
                  <ContactPage />
                </PageTitle>
              } />
              
              <Route path="*" element={
                <PageTitle title="Page Not Found | Cooks Delight">
                  <NotFound />
                </PageTitle>
              } />
            </Route>

            <Route path="login" element={
              <PageTitle title="Login | Cooks Delight">
                <Login />
              </PageTitle>
            } />
            
            <Route path="register" element={
              <PageTitle title="Sign Up | Cooks Delight">
                <Signup />
              </PageTitle>
            } />

            <Route path="dashboard" element={
              <PageTitle title="Dashboard | Cooks Delight">
                <DashboardPageExample />
              </PageTitle>
            } />

                        <Route path="ComponentShowcase" element={
              <PageTitle title="Dashboard | Cooks Delight">
                <ComponentShowcase />
              </PageTitle>
            } />

          </Routes>

        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;

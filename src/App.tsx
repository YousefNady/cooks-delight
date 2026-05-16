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
import DashboardPageExample from './features/dashboard/pages/DashboardPage';
import ComponentShowcase from './features/dashboard/components/ComponentShowcase.example';
import Favorites from './features/dashboard/pages/FavoritesPage';
import Recentlyviewed from './features/dashboard/pages/Recentlyviewedpage';
import Explore from './features/dashboard/pages/ExplorePage';
import ProfileDashboard from './features/dashboard/pages/Profilepage';
import SettingsPage from './features/dashboard/pages/SettingsPage';
import ProtectedRoute from './shared/components/ProtectedRoute/ProtectedRoute'; // 👈 newimport  ComingSoon  from './features/coming-soon/ComingSoon';
import AIChef from './features/chatbot/components/chatbot';
import SmartChefPage from './features/chatbot/components/SmartChefPage';
import { ComingSoon } from './features/coming-soon';


function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ScrollRestoration />
            <AIChef />
          <Routes>
            {/* ── Public routes inside shared Layout ── */}
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

              {/* 🔒 Protected — inside Layout */}
              <Route path="profile" element={
                <ProtectedRoute>
                  <PageTitle title="My Profile | Cooks Delight">
                    <ProfilePage />
                  </PageTitle>
                </ProtectedRoute>
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

              <Route
              path="/coming-soon"
              element={
                <PageTitle title="Coming Soon | Cooks Delight">
                  <ComingSoon/>
                </PageTitle>
              }
            />
                            <Route
                path="smart-chef"
                element={<SmartChefPage />}
              />
              <Route path="*" element={
                <PageTitle title="Page Not Found | Cooks Delight">
                  <NotFound />
                </PageTitle>
              } />
            </Route>

            {/* ── Auth routes (no Layout) ── */}
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

            {/* ── Public dashboard-area routes ── */}
            <Route path="favorites" element={
              <PageTitle title="My Favorites | Cooks Delight">
                <Favorites />
              </PageTitle>
            } />

            <Route path="recently-viewed" element={
              <PageTitle title="Recently Viewed | Cooks Delight">
                <Recentlyviewed />
              </PageTitle>
            } />

            <Route path="explore" element={
              <PageTitle title="Explore | Cooks Delight">
                <Explore />
              </PageTitle>
            } />

            <Route path="ComponentShowcase" element={
              <PageTitle title="Dashboard | Cooks Delight">
                <ComponentShowcase />
              </PageTitle>
            } />

            {/* 🔒 Protected routes ── */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <PageTitle title="Dashboard | Cooks Delight">
                  <DashboardPageExample />
                </PageTitle>
              </ProtectedRoute>
            } />

            <Route path="profile-dashboard" element={
              <ProtectedRoute>
                <PageTitle title="Profile | Cooks Delight">
                  <ProfileDashboard />
                </PageTitle>
              </ProtectedRoute>
            } />

            <Route path="settings" element={
              <ProtectedRoute>
                <PageTitle title="Settings | Cooks Delight">
                  <SettingsPage />
                </PageTitle>
              </ProtectedRoute>
            } />

          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
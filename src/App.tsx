import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import CookingTips from './pages/CookingTips';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import NotFound from './pages/NotFound'; 
import Layout from './shared/components/layout/Layout';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipe/:id" element={<RecipeDetails />} />
          <Route path="tips" element={<CookingTips />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="login" element={<Login />} />
                
        {/* Future feature: Coming soon */}
        <Route path="/register" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
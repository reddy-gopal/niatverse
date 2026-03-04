import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireOnboarding from './components/RequireOnboarding';
import Home from './pages/Home';
import CampusDirectory from './pages/CampusDirectory';
import Campus from './pages/Campus';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Article from './pages/Article';
import Articles from './pages/Articles';
import Search from './pages/Search';
import Contribute from './pages/Contribute';
import WriteArticle from './pages/WriteArticle';
import HowToGuides from './pages/HowToGuides';
import Guide from './pages/Guide';
import MyArticles from './pages/MyArticles';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Unprotected: login, register, onboarding (must complete profile before platform access) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected: complete onboarding first for Founding Editors */}
        <Route path="/" element={<RequireOnboarding><Home /></RequireOnboarding>} />
        <Route path="/guide" element={<RequireOnboarding><Guide /></RequireOnboarding>} />
        <Route path="/campuses" element={<RequireOnboarding><CampusDirectory /></RequireOnboarding>} />
        <Route path="/articles" element={<RequireOnboarding><Articles /></RequireOnboarding>} />
        <Route path="/how-to-guides" element={<RequireOnboarding><HowToGuides /></RequireOnboarding>} />
        <Route path="/campus/:id" element={<RequireOnboarding><Campus /></RequireOnboarding>} />
        <Route path="/campus/:id/clubs" element={<RequireOnboarding><Clubs /></RequireOnboarding>} />
        <Route path="/campus/:id/clubs/:clubId" element={<RequireOnboarding><ClubDetail /></RequireOnboarding>} />
        <Route path="/campus/:id/article/:articleId" element={<RequireOnboarding><Article /></RequireOnboarding>} />
        <Route path="/article/:articleId" element={<RequireOnboarding><Article /></RequireOnboarding>} />
        <Route path="/search" element={<RequireOnboarding><Search /></RequireOnboarding>} />
        <Route path="/contribute" element={<RequireOnboarding><Contribute /></RequireOnboarding>} />
        <Route path="/contribute/write" element={<RequireOnboarding><WriteArticle /></RequireOnboarding>} />
        <Route path="/profile" element={<RequireOnboarding><Profile /></RequireOnboarding>} />
        <Route path="/my-articles" element={<RequireOnboarding><MyArticles /></RequireOnboarding>} />
      </Routes>
    </Router>
  );
}

export default App;

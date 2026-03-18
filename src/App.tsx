import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireOnboarding from './components/RequireOnboarding';

const Home = lazy(() => import('./pages/Home'));
const CampusDirectory = lazy(() => import('./pages/CampusDirectory'));
const Campus = lazy(() => import('./pages/Campus'));
const Clubs = lazy(() => import('./pages/Clubs'));
const ClubDetail = lazy(() => import('./pages/ClubDetail'));
const Article = lazy(() => import('./pages/Article'));
const Articles = lazy(() => import('./pages/Articles'));
const Search = lazy(() => import('./pages/Search'));
const Contribute = lazy(() => import('./pages/Contribute'));
const WriteArticle = lazy(() => import('./pages/WriteArticle'));
const HowToGuides = lazy(() => import('./pages/HowToGuides'));
const Guide = lazy(() => import('./pages/Guide'));
const MyArticles = lazy(() => import('./pages/MyArticles'));
const Profile = lazy(() => import('./pages/Profile'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function AppLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full border-2 border-[#fbf2f3] size-10 border-t-[#991b1b]" role="status" aria-label="Loading" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<AppLoader />}>
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
          <Route path="/campus/:slug" element={<RequireOnboarding><Campus /></RequireOnboarding>} />
          <Route path="/campus/:slug/clubs" element={<RequireOnboarding><Clubs /></RequireOnboarding>} />
          <Route path="/campus/:slug/clubs/:clubId" element={<RequireOnboarding><ClubDetail /></RequireOnboarding>} />
          <Route path="/campus/:slug/article/:articleId" element={<RequireOnboarding><Article /></RequireOnboarding>} />
          <Route path="/article/:articleId" element={<RequireOnboarding><Article /></RequireOnboarding>} />
          <Route path="/search" element={<RequireOnboarding><Search /></RequireOnboarding>} />
          <Route path="/contribute" element={<RequireOnboarding><Contribute /></RequireOnboarding>} />
          <Route path="/contribute/write" element={<RequireOnboarding><WriteArticle /></RequireOnboarding>} />
          <Route path="/profile" element={<RequireOnboarding><Profile /></RequireOnboarding>} />
          <Route path="/my-articles" element={<RequireOnboarding><MyArticles /></RequireOnboarding>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

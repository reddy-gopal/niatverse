import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/campuses" element={<CampusDirectory />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/how-to-guides" element={<HowToGuides />} />
        <Route path="/campus/:id" element={<Campus />} />
        <Route path="/campus/:id/clubs" element={<Clubs />} />
        <Route path="/campus/:id/clubs/:clubId" element={<ClubDetail />} />
        <Route path="/campus/:id/article/:articleId" element={<Article />} />
        <Route path="/article/:articleId" element={<Article />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/contribute/write" element={<WriteArticle />} />
      </Routes>
    </Router>
  );
}

export default App;

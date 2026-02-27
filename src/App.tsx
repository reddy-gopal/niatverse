import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CampusDirectory from './pages/CampusDirectory';
import Campus from './pages/Campus';
import Article from './pages/Article';
import Articles from './pages/Articles';
import Search from './pages/Search';
import Contribute from './pages/Contribute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campuses" element={<CampusDirectory />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/campus/:id" element={<Campus />} />
        <Route path="/campus/:id/article/:articleId" element={<Article />} />
        <Route path="/article/:articleId" element={<Article />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contribute" element={<Contribute />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NameAnalysis from './components/NameAnalysis';
import CovidAnalysis from './components/CovidStats';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Container from './components/common/Container';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100">
        <Header />
        <main className="flex-grow">
          <Container className="py-14 lg:py-20">
            <Routes>
              <Route path="/" element={<NameAnalysis />} />
              <Route path="/covid" element={<CovidAnalysis />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

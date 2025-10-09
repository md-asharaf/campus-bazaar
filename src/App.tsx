import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { Footer } from './components/layout/Footer'
import { Categories } from './pages/Categories'
import { Products } from './pages/Products'
import About from './pages/About'
import NotFound from './pages/NotFound'

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Router>
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/items" element={<Products />} />
                        <Route path="/about" element={<About />} />
                        {/* NotFound route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </div>
    )
}

export default App
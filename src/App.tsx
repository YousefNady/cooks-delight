import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<h1>Home Page (Soon)</h1>} />
          <Route path="/login" element={<h1>Login Page (Soon)</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Upload />} />
          <Route path="insights/:key" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

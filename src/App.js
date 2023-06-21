import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePages from "./pages/HomePages"
import TambahPinjamPages from "./pages/TambahPinjamPages"
import DaftarPinjamPages from './pages/DaftarPinjamPages';

function App() {
  return (
<Routes>
  <Route path="/" element={<HomePages/>}/>
  <Route path="/tambah" element={<TambahPinjamPages/>}/>
  <Route path="/daftarPeminjam" element={<DaftarPinjamPages/>}/>
  <Route path="/total" element={<HomePages/>}/>
</Routes>
  )
}

export default App;

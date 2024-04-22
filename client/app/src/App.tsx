import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Homepage from './pages/home/homepage';
import Account from './pages/home/account';
import Login from './pages/home/login';
import Sinhvien from './component/content/Sinhvien';
import LopHoc from './component/content/LopHoc';
import Read from './component/content/crdu-LH/read';
import Create from './component/content/crdu-LH/create';
import Create_sv from './component/content/crdu-SV/create';
import Read_sv from './component/content/crdu-SV/read';
import Test from './component/content/crdu-LH/test';
import Nopage from './pages/home/Nopage';


function App() {

  localStorage.setItem("api", "0177e09f564ea6fb08fbe969b6c70877");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />}>
          <Route path='/administrator/builder/data/sinh-vien.html' element={<Sinhvien />} />  
          <Route path='/read_sinhvien/:id' element={<Read_sv />} />
          <Route path='/account' element={<Account />} />
          <Route path='/create_sinhvien' element={<Create_sv />}/>
          <Route path='/administrator/builder/data/lop-hoc.html' element={<LopHoc />} />
          <Route path='/read/:id' element={<Read />} />  
          <Route path='/create_lophoc' element={<Create />} />  
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/test' element={<Test />} />
        <Route path='*' element={<Nopage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

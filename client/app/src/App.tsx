import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/home/homepage';
import Account from './member/account';
import Login from './member/login';
import Sinhvien from './component/content/Sinhvien';
import LopHoc from './component/content/LopHoc';
import Create_sv from './component/content/crdu-SV/create';
import Read_sv from './component/content/crdu-SV/read';
import Test from './component/content/crdu-LH/test';
import Nopage from './pages/home/Nopage';
import TreeFolder from './component/content/Builder-folder/treeFolder';
import EditFolder from './component/content/Builder-folder/editFolder';
import CreateFolder from './component/content/Builder-folder/createFolder';
import AllForm from './component/content/Builder-form/allForm';
import CreateForm from './component/content/Builder-form/createForm';
import AllFormField from './component/content/Builder-form/allFormField';
import CreateFormField from './component/content/Builder-form/createFormField';
import EditFormField from './component/content/Builder-form/editFormField';
import EditForm from './component/content/Builder-form/EditForm';
import EditLop from './component/content/crdu-LH/EditLop';
import Create from './component/content/crdu-LH/create';

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
          <Route path='/read/:id' element={<EditLop />} />  
          <Route path='/create_lophoc' element={<Create/>} />  
          <Route path='/administrator/internship/builder/folder.html' element={<TreeFolder />}/>
          <Route path='/editfolder/:id' element={<EditFolder />}/>
          <Route path='/create-folder' element={<CreateFolder />}/>
          <Route path='/administrator/internship/builder/form.html' element={<AllForm />} />
          <Route path='/create-form' element={<CreateForm />}/>
          <Route path='/edit-form/:id' element={<EditForm />}/>
          <Route path='/formfield/:id' element= {<AllFormField/>} />
          <Route path='/create-formfield' element={<CreateFormField />}/>
          <Route path='/editformfield/:id' element={<EditFormField />}/>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/test' element={<Test />} />
        <Route path='*' element={<Nopage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

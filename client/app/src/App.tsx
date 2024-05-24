import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/layout/HomePage';
import Account from './components/member/Account';
import Login from './components/member/Login';
import SinhVien from './pages/SinhVien/SinhVien';
import LopHoc from './pages/LopHoc/LopHoc';
import CreateSinhVien from './pages/SinhVien/CreateAndEditSinhVien/CreateSinhVien';
import EditSinhVien from './pages/SinhVien/CreateAndEditSinhVien/EditSinhVien';
import TreeFolder from './pages/Folder/Folder';
import EditFolder from './pages/Folder/EditAndCreateFolder/EditFolder';
import CreateFolder from './pages/Folder/EditAndCreateFolder/CreateFolder';
import FormField from './pages/Form/FormField';
import CreateForm from './pages/Form/CreateAndEditForm/CreateForm';
import Form from './pages/Form/Form';
import EditFormField from './pages/Form/CreateAndEditFormField/EditFormField';
import EditForm from './pages/Form/CreateAndEditForm/EditForm';
import EditLop from './pages/LopHoc/CreateAndEditLopHoc/EditLop';
import CreateLop from './pages/LopHoc/CreateAndEditLopHoc/CreateLop';
import PageNotFound from './components/layout/PageNotFound';
import Register from './components/member/Register';
import CreateFormField from './pages/Form/CreateAndEditFormField/CreateFormField';

function App() {

  localStorage.setItem("api", "0177e09f564ea6fb08fbe969b6c70877");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}>
          <Route path='/administrator/builder/data/sinh-vien.html' element={<SinhVien />} />  
          <Route path='/administrator/builder/data/sinh-vien/edit/:id.html' element={<EditSinhVien />} />
          <Route path='/administrator/builder/data/sinh-vien/create.html' element={<CreateSinhVien />}/>
          <Route path='/administrator/builder/data/lop-hoc.html' element={<LopHoc />} />
          <Route path='/administrator/builder/data/lop-hoc/edit/:id.html' element={<EditLop />} />  
          <Route path='/administrator/builder/data/lop-hoc/create.html' element={<CreateLop/>} />  
          <Route path='/administrator/internship/builder/folder.html' element={<TreeFolder />}/>
          <Route path='/administrator/internship/builder/folder/edit/:id.html' element={<EditFolder />}/>
          <Route path='/administrator/internship/builder/folder/create.html' element={<CreateFolder />}/>
          <Route path='/administrator/internship/builder/form.html' element={<Form />} />
          <Route path='/administrator/internship/builder/form/edit/:id.html' element={<EditForm />}/>
          <Route path='/administrator/internship/builder/form/create.html' element={<CreateForm />}/>
          <Route path='/administrator/internship/builder/formfield/:id.html' element= {<FormField/>} />
          <Route path='/administrator/internship/builder/formfield/create' element={<CreateFormField />}/>
          <Route path='/administrator/internship/builder/formfield/edit/:id.html' element={<EditFormField />}/>
        </Route>
        <Route path='/account' element={<Account />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

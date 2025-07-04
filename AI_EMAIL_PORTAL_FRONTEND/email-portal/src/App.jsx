import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import JobForm from './Pages/JobForm';
import JobListingPage from './Pages/JobListingPage';
import JobApplication from './Pages/JobApplication';
import HomePage from './Pages/HomePage';
import NavbarComponent from './components/Navbar';
import UserAppliedJobsPage from './Pages/UserAppliedJobsPage';
import JobExtraction from './Pages/JobExtraction';
import PromptSettings from './Pages/Settings';
import MailViewer from './Pages/Mails';
function App() {

  return (
    <>
      {<NavbarComponent />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/myjobs" element={<UserAppliedJobsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobform" element={<JobForm />} />
        <Route path="/joblist" element={< JobListingPage />} />
        <Route path="/jobapplication/:id" element={< JobApplication />} />
        <Route path="/extract" element={< JobExtraction />} />
        <Route path="/settings" element={< PromptSettings />} />
        <Route path="/mails" element={< MailViewer />} />
      </Routes>
    </>
  )
}

export default App

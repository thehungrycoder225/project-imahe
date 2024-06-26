import './App.css';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserRegistration from './pages/UserRegistration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './middleware/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RegisterSuccess from './pages/RegisterSuccess';
import Gallery from './pages/Gallery';
import Footer from './components/Footer';

function App() {
  return (
    <div className='container'>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Gallery />} />
            <Route path='/register' element={<UserRegistration />} />
            <Route path='/register-success' element={<RegisterSuccess />} />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile/:userId'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
      <Footer />
    </div>
  );
}

export default App;

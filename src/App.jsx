import './App.css';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './middleware/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Button from './components/Button';
import FormControl from './components/FormControl';

function App() {
  return (
    <div className='container'>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
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
    </div>
  );
}

export default App;

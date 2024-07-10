// src/App.jsx

import { useState, createContext, useEffect } from 'react';

// src/App.jsx

import { Routes, Route, useNavigate } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import * as authService from '../src/services/authService'; // import the authservice
import * as hootService from './services/hootService';
import HootList from './components/HootList/HootList';
// src/App.jsx

import HootDetails from './components/HootDetails/HootDetails';
// src/App.jsx

import HootForm from './components/HootForm/HootForm';
// src/components/HootDetails/HootDetails.jsx





export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [hoots, setHoots] = useState([]);

  const navigate = useNavigate();

  //use effect cannot be set async so we make a function inside of it
  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
  
      // Set state:
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);
//user is put inside the array, this ensure that useEffect runs everytime the 
//user state changes


// src/App.jsx

const handleAddHoot = async (hootFormData) => {
  const newHoot = await hootService.create(hootFormData);
  setHoots([newHoot, ...hoots]);
  navigate('/hoots');
};

// src/App.jsx

const handleDeleteHoot = async (hootId) => {
  // Call upon the service function:
  const deletedHoot = await hootService.deleteHoot(hootId);
  // Filter state using deletedHoot._id:
  setHoots(hoots.filter((hoot) => hoot._id !== deletedHoot._id));
  // Redirect the user:
  navigate('/hoots');
};

const handleUpdateHoot = async (hootId, hootFormData) => {
  const updatedHoot = await hootService.update(hootId, hootFormData);

  setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));

  navigate(`/hoots/${hootId}`);
};

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
        {user ? (
    // Protected Routes:
    <>
      <Route path="/" element={<Dashboard user={user} />} />
      <Route path="/hoots" element={<HootList hoots={hoots} />} />
      <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
      
<Route
  path="/hoots/:hootId/edit"
  element={<HootForm handleUpdateHoot={handleUpdateHoot} />}
/>


     
<Route
  path="/hoots/:hootId"
  element={<HootDetails handleDeleteHoot={handleDeleteHoot} />}
/>
      
    </>
  ) : (
    // Public Route:
    <Route path="/" element={<Landing />} />
  )}
  <Route path="/signup" element={<SignupForm setUser={setUser} />} />
  <Route path="/signin" element={<SigninForm setUser={setUser} />} />
</Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;

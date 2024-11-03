import React from 'react'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { BrowserRouter as Router  , Routes,Route } from 'react-router-dom';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
            <Route path='/dashboard' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
        </Routes>
      </Router>
      {/* <h1 className="text-red-200 font-bold underline">
      Hello world!
    </h1> */}
    </div>
  )
}

export default App;

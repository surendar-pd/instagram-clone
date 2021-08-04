import './App.css';
import styled from 'styled-components';
import{Switch, Route, HashRouter,Link} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import { useState } from 'react';
import {auth,db} from './firebase';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const signOut = () =>{
    auth.signOut().then(()=>{
    localStorage.removeItem('user')
    setUser(null);
    window.location.href = '/';
  })
}
  return (
    <div>
      {
        !user ? 
        <Login setUser={setUser}/>
        :
        <Home signOut={signOut} user={user}/>
      }
    </div>
  );
}

export default App;

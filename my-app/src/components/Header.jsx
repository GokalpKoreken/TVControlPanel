import React from 'react';
import './Header.css';
import ArcelikLogo from './images/arcelik_logo_beyaz.png'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const Header = () => {
    const location = useLocation();
    const [route, setRoute] = useState('');
    const [StringforHeader,setStringforHeader] = useState('')
    useEffect(() => {
    // Get the current route
    const currentRoute = location.pathname;

    setRoute(currentRoute);
    let temp = (currentRoute != '/SystemInfo') ? currentRoute.substring(1, currentRoute.length) + ' Settings' : 'System Info';
    if(currentRoute =='/' )
    {
      temp = 'Sound Settings'
    }
    setStringforHeader(temp)
  }, [location]);

  return (
    <header className='Header-holder' style={{position: "sticky"}}>
      <h1 className='Title'>{StringforHeader}</h1>
      <div className='image-holder'>
        <img src={ArcelikLogo} alt="Beko Logo" />
      </div>
    </header>
  );
}

export default Header;

import React, { useState } from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideBar.css'
import { useNavigate } from 'react-router';

const SideBar = () => {
    const navigate = useNavigate();
   
  return (
    <SideNav onSelect={(selected) => {
        navigate('/'+selected)
    }} className = 'mysidebar'>
      <SideNav.Toggle  />
      <SideNav.Nav defaultSelected="Sound">

        <NavItem eventKey="Sound">
          <NavIcon><i className="fas fa-volume-up" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>SOUND</NavText>
        </NavItem>

        <NavItem eventKey="Configuration">
          <NavIcon><i className="fas fa-cog" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>CONFIGURATION</NavText>
        </NavItem>

        <NavItem eventKey="Device">
          <NavIcon><i className="fas fa-tv" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>DEVICE</NavText>
        </NavItem>
        
        <NavItem eventKey="Network">
          <NavIcon><i className="fas fa-network-wired" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>NETWORK</NavText>
        </NavItem>

        <NavItem eventKey="Picture">
          <NavIcon><i className="fas fa-image" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>PICTURE</NavText>
        </NavItem>

        <NavItem eventKey="Source">
          <NavIcon><i className="fas fa-code" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>SOURCE</NavText>
        </NavItem>
        
        <NavItem eventKey="Timer">
          <NavIcon><i className="fas fa-clock" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>CLOCK</NavText>
        </NavItem>

        <NavItem eventKey="System">
          <NavIcon><i className="fas fa-cogs" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>SYSTEM</NavText>
        </NavItem>

        <NavItem eventKey="SystemInfo">
          <NavIcon><i className="fas fa-info-circle" style={{ fontSize: '1.5em' }}></i></NavIcon>
          <NavText>SYSTEM INFO</NavText>
        </NavItem>


      </SideNav.Nav>
    </SideNav>
  );
};

export default SideBar;

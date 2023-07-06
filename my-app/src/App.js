import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SideBar from './components/SideBar';
import SoundControl from './components/Pages/SoundControl';
import ConfigurationControl from './components/Pages/ConfigurationControl';
import DeviceControl from './components/Pages/DeviceControl';
import NetworkControl from './components/Pages/NetworkControl';
import PictureControl from './components/Pages/PictureControl';
import SourceControl from './components/Pages/SourceControl';
import TimerControl from './components/Pages/TimerControl';
import SystemControl from './components/Pages/SystemControl';
import SystemInfoControl from './components/Pages/SystemInfoControl';
import Header from './components/Header';
import WebSocketManager from './components/WebSocketManager';
const App = () => {

  return (
    <div>
      <WebSocketManager/>
      <Router>
        <Header />
        <div className='allContent'>
          <div className="app-container">
            <SideBar className="mysidebar" />
            <div className="content">
              <Routes>
                <Route path="/Sound" element={<SoundControl />} />
                <Route path="/Configuration" element={<ConfigurationControl />} />
                <Route path="/Device" element={<DeviceControl />} />
                <Route path="/Network" element={<NetworkControl />} />
                <Route path="/Picture" element={<PictureControl />} />
                <Route path="/Source" element={<SourceControl />} />
                <Route path="/Timer" element={<TimerControl />} />
                <Route path="/System" element={<SystemControl />} />
                <Route path="/SystemInfo" element={<SystemInfoControl />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
    
  );
};

export default App;

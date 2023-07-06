import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DeviceControl.css';

const DeviceControl = () => {
  const [backLightEnabled, setBackLightEnabled] = useState(false);
  const [sleepManagementMenuVisible, setSleepManagementMenuVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [powerManagementMenuVisible, setPowerManagementMenuVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Stand-by Mode');
  const [sleepMode, setSleepMode] = useState('Off');

  useEffect(() => {
    const connectWebSocket = async () => {
      const ws = new WebSocket('ws://localhost:4000');
      await new Promise((resolve) => {
        ws.addEventListener('open', resolve);
      });

      setSocket(ws);
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);


  useEffect(() => {
    const handleSocketMessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed data:', data);
        
        if (data[0].type === 'powermode') {  
          setSelectedMode(data[0].value)
          
        } 
        if (data[1].type === 'backlight') {
          setBackLightEnabled(data[1].value)
        }
        if(data[2].type === 'sleep')
        {
          setSleepMode(data[2].value)
        }

      } catch (error) {

        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'DeviceControl',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);

  const sendBackLightData = (newBackLight) => {
    if (socket) {
      const data = {
        type: 'backlight',
        value: !newBackLight,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendPowerModeData = (mode) => {
    if (socket) {
      const data = {
        type: 'powermode',
        value: mode,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendSleepData = (mode) => {
    if (socket) {
      const data = {
        type: 'sleep',
        value: mode,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const handleBackLightToggle = () => {
    const newBackLightEnabled = !backLightEnabled;
    setBackLightEnabled(newBackLightEnabled);
    sendBackLightData(backLightEnabled);
  };

  const handlePowerManagementClick = () => {
    setPowerManagementMenuVisible(!powerManagementMenuVisible);
    if(sleepManagementMenuVisible)
    {
      setSleepManagementMenuVisible(!sleepManagementMenuVisible);
    }
  };

  const handlePowerManagementClickMenu = (mode) => {
    setPowerManagementMenuVisible(!powerManagementMenuVisible);
    setSelectedMode(mode);
    sendPowerModeData(mode);
  };

  const handleSleepManagementClick = () => {
    setSleepManagementMenuVisible(!sleepManagementMenuVisible);
    if(powerManagementMenuVisible)
    {
      setPowerManagementMenuVisible(!powerManagementMenuVisible)
    }
  };

  const handleSleepManagementClickMenu = (mode) => {
    setSleepManagementMenuVisible(!sleepManagementMenuVisible);
    setSleepMode(mode);
    sendSleepData(mode);
  };

  return (
    <div className="App">
      <Table className="table-dark">
        <tbody>
          <tr>
            <td className="Attribute" onClick={() => handlePowerManagementClick('')}>
              <div>
                <h4 className="title">Power Settings</h4>
              </div>
              <div className="Attribute_Holder">
              <h5>{powerManagementMenuVisible ? '' : selectedMode}</h5>
                <label htmlFor="powerManagementCheckbox" />
                <div className='tableWrapper'>
                {powerManagementMenuVisible && (
              <Table className="table-dark slide-down-animation">
                <tbody className="Menu">
                  <tr>
                    <td className="visible_menu_wrapper" onClick={() => handlePowerManagementClickMenu('Stand-by Mode')}>
                      <div>
                        <h5 className="title">Stand-by Mode</h5>
                      </div>
                    </td>
                    <td className="visible_menu_wrapper" onClick={() => handlePowerManagementClickMenu('Last Mode')}>
                      <div>
                        <h5 className="title">Last Mode</h5>
                      </div>
                    </td>
                    <td className="visible_menu_wrapper" onClick={() => handlePowerManagementClickMenu('Normal Mode')}>
                      <div>
                        <h5 className="title">Normal Mode</h5>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
          )}

                </div>
              </div>
            </td>
          </tr>
          
          <tr>
            <td className="Attribute">
              <div>
                <h4 className="title">Screen Backlight</h4>
              </div>
              <div className="Attribute_Holder">
              <input
                id="backLightCheckbox"
                type="checkbox"
                className="switch"
                checked={backLightEnabled}
                onClick={handleBackLightToggle}
                readOnly
              />
                <label htmlFor="backLightCheckbox" />
              </div>
            </td>
            <td className="Attribute" onClick={() => handleSleepManagementClick('')}>
              <div>
                <h4 className="title">Sleep Time</h4>
              </div>
              <div className="Attribute_Holder">
              <h5>{sleepManagementMenuVisible ? '' : (sleepMode !== 'Off' ? sleepMode + ' Minutes' : 'Off')}</h5>
                <label htmlFor="powerManagementCheckbox" />
                <div className='tableWrapper'>
                {sleepManagementMenuVisible && (
              <Table className="table-dark slide-down-animation">
                <tbody className="Menu">
                  <tr>
                    <td className="visible_menu_wrapper" onClick={() => handleSleepManagementClickMenu('Off')}>
                      <div>
                        <h5 className="title">Off</h5>
                      </div>
                    </td>
                    <td className="visible_menu_wrapper" onClick={() => handleSleepManagementClickMenu('30')}>
                      <div>
                        <h5 className="title">30 Minutes</h5>
                      </div>
                    </td>
                    <td className="visible_menu_wrapper" onClick={() => handleSleepManagementClickMenu('60')}>
                      <div>
                        <h5 className="title">60 Minutes</h5>
                      </div>
                    </td>
                    <td className="visible_menu_wrapper" onClick={() => handleSleepManagementClickMenu('120')}>
                      <div>
                        <h5 className="title">120 Minutes</h5>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
                </div>
               
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default DeviceControl;

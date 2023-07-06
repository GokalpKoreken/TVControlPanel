import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './Configuration.css'; // Import the CSS file for custom styling

const ConfigurationControl = () => {
  const [eyeCareEnabled, setEyeCareEnabled] = useState(false);
  const [wakeOnLANEnabled, setWakeOnLANEnabled] = useState(false);
  const [socket, setSocket] = useState(null); 

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
        
        if (data[0].type === 'eyecare') {  
          setEyeCareEnabled(data[0].value)
          
        } 
        if (data[1].type === 'wakeonlan') {
          setWakeOnLANEnabled(data[1].value)
        }
      } catch (error) {

        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'Configuration',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);

  const sendEyeCareData = (newEyeCare) => {
    if (socket) {
      const data = {
        type: 'eyecare',
        value: !newEyeCare,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendWakeonLanData = (newWakeonLan) => {
    if (socket) {
      const data = {
        type: 'wakeonlan',
        value: !newWakeonLan,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const handleEyeCareToggle = () => {
    setEyeCareEnabled(!eyeCareEnabled);
    console.log(wakeOnLANEnabled)
    sendEyeCareData(eyeCareEnabled)
  };

  const handleWakeOnLANToggle = () => {
    setWakeOnLANEnabled(!wakeOnLANEnabled);
    sendWakeonLanData(wakeOnLANEnabled)
  };

  return (
    <div className="App">
      <Table className="table-dark">
        <tbody>
          <tr>
            <td className="Attribute">
              <div>
                <h4 className='title'>Eye Care</h4>
              </div>
              <div className="Attribute_Holder">
              <input
                   id="eyeCareCheckbox"
                   type="checkbox"
                   className="switch"
                   checked={eyeCareEnabled}
                   onClick={handleEyeCareToggle}
                   readOnly
                />
                <label htmlFor="eyeCareCheckbox" />
              </div>
            </td>
            <td className="Attribute" >
              <div>
                <h4 className='title'>Wake-on-LAN</h4>
              </div>
              <div className="Attribute_Holder">
              <input
                  id="wakeOnLANCheckbox"
                  type="checkbox"
                  className="switch"
                  checked={wakeOnLANEnabled}
                  onClick={handleWakeOnLANToggle}
                  readOnly
                />
                <label htmlFor="wakeOnLANCheckbox" />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ConfigurationControl;

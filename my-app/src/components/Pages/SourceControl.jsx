import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DeviceControl.css';

const SourceControl = () => {
  const [lastSource,setLastSource] = useState('Android')
  const [socket, setSocket] = useState(null); 
  const [SourceManagementMenuVisible, setPowerManagementMenuVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState('Android');

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

        if (data[0].type === 'source') {
          setLastSource(data[0].value)
          setSelectedSource(data[0].value)
  
        }
      } catch (error) {
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'SourceControl',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);

  const sendSourceData = (newSource) => {
    if (socket) {
      const data = {
        type: 'source',
        value: newSource,
      };
      socket.send(JSON.stringify(data));
    }
  };


  const handleSourceManagementClickMenu = (source) => {
    setPowerManagementMenuVisible(!SourceManagementMenuVisible);
      if(source !== selectedSource)
      {
        setLastSource(selectedSource);
      }
    setSelectedSource(source);
    sendSourceData(source);
  };
  

  const handleSourceManagementClick = () => {
    setPowerManagementMenuVisible(!SourceManagementMenuVisible);
  };

  const handleLastInput = () =>
  {
      setSelectedSource(lastSource)
      sendSourceData(lastSource)
  }

  return (
    <div className="App">
      <Table className="table-dark">
        <tbody>
          <tr>
            <td className="Attribute">
              <div>
                <h4 className='title'>Source</h4>
              </div>
              <div className="Attribute_Holder"  onClick={() => handleSourceManagementClick('')}>
              <h5>{SourceManagementMenuVisible ? '' : selectedSource}</h5>
                <label htmlFor="powerManagementCheckbox" />
                <div className='tableWrapper'>
                {SourceManagementMenuVisible && (
                <Table className="table-dark slide-down-animation">
                  <tbody className="Menu">
                    <tr>
                      <td className="visible_menu_wrapper" onClick={() => handleSourceManagementClickMenu('Android')}>
                        <div>
                          <h5 className="title">Android</h5>
                        </div>
                      </td>
                      <td className="visible_menu_wrapper" onClick={() => handleSourceManagementClickMenu('PC Slot')}>
                        <div>
                          <h5 className="title">PC Slot</h5>
                        </div>
                      </td> 
                      <td className="visible_menu_wrapper" onClick={() => handleSourceManagementClickMenu('Android Slot')}>
                        <div>
                          <h5 className="title">Android Slot</h5>
                        </div>
                      </td>
                      <td className="visible_menu_wrapper" onClick={() => handleSourceManagementClickMenu('HDMI1')}>
                        <div>
                          <h5 className="title">HDMI1</h5>
                        </div>
                      </td>
                      <td className="visible_menu_wrapper" onClick={() => handleSourceManagementClickMenu('VGA1')}>
                        <div>
                          <h5 className="title">VGA1</h5>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
              </div>
            </td>
            <td className="Attribute" >
              <div>
                <h4 className='title'>Change to Last Source</h4>
              </div>
              <div className="Attribute_Holder">
              <button onClick={handleLastInput} className="iphone-button">
                  Change
              </button>
                <label htmlFor="wakeOnLANCheckbox" />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default SourceControl
import React, { useState, useEffect } from 'react';
import './DeviceControl.css';
import { Table } from 'react-bootstrap';

const PictureControl = () => {
  const [backLight, setbackLight] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [sharpness, setSharpness] = useState(50);
  const [contrast, setContrast] = useState(50);
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

        if (data[0].type === 'backlight') {
          setbackLight(data[0].value)
  
        }
        if (data[1].type === 'brightness') {
          setBrightness(data[1].value)
 
        }
        if (data[2].type === 'sharpness') {
          setSharpness(data[2].value)

        }
        if(data[3].type == 'contrast')
        {
          setContrast(data[3].value)
        }
      } catch (error) {
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'PictureControl',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);

  const handleBacklightChange = (event) => {
    const newBacklight = event.target.value;
    setbackLight(newBacklight);
    sendBackLightData(newBacklight);
  };

  const handleBrightnessChange = (event) => {
    const newBrightness = event.target.value;
    setBrightness(newBrightness);
    sendBrightnessData(newBrightness);
  };

  const handleSharpnessChange = (event) => {
    const newSharpness = event.target.value;
    setSharpness(newSharpness);
    sendSharpnessData(newSharpness);
  };

  const handleContrastChange = (event) => {
    const newContrast = event.target.value;
    setContrast(newContrast);
    sendContrastData(newContrast);
  };

  const sendBackLightData = (backlightData) => {
    if (socket) {
      const data = {
        type: 'backlight',
        value: backlightData,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendBrightnessData = (brightnessData) => {
    if (socket) {
      const data = {
        type: 'brightness',
        value: brightnessData,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendSharpnessData = (sharpnessData) => {
    if (socket) {
      const data = {
        type: 'sharpness',
        value: sharpnessData,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendContrastData = (contrastData) => {
    if (socket) {
      const data = {
        type: 'contrast',
        value: contrastData,
      };
      socket.send(JSON.stringify(data));
    }
  };

  return (
    <div className="App">
      <Table className="table-dark">
        <tbody>
          <tr>
            <td className="Attribute">
              <div className="title">
                <h4>Backlight</h4>
              </div>
              <div className="Attribute_Holder">
                <input type="range" min="0" max="100" value={backLight} onChange={handleBacklightChange} />
                <p>Current Backlight: {backLight}</p>
              </div>
            </td>
            <td className="Attribute">
              <div className="title">
                <h4>Brightness</h4>
              </div>
              <div className="Attribute_Holder">
                <input type="range" min="0" max="100" value={brightness} onChange={handleBrightnessChange} />
                <p>Current Brightness: {brightness}</p>
              </div>
            </td>
            <td className="Attribute">
              <div className="title">
                <h4>Sharpness</h4>
              </div>
              <div className="Attribute_Holder">
                <input type="range" min="0" max="100" value={sharpness} onChange={handleSharpnessChange} />
                <p>Current Sharpness: {sharpness}</p>
              </div>
            </td>
            <td className="Attribute">
              <div className="title">
                <h4>Contrast</h4>
              </div>
              <div className="Attribute_Holder">
                <input type="range" min="0" max="100" value={contrast} onChange={handleContrastChange} />
                <p>Current Contrast: {contrast}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default PictureControl;
  
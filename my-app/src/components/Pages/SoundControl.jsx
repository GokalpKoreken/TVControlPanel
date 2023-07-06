import React, { useState, useEffect } from 'react';
import './SoundControl.css';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const SoundControl = () => {
  const [volume, setVolume] = useState(50);
  const [mute, setMute] = useState(false);
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
        if (data[0].type === 'volume') {
          setVolume(data[0].value);
          setMute(data[0].value === 0 ? true : false);
        } 
        if (data[1].type == 'mute') {
          setMute(data[1].value);
          if (data[1].value) {
            setVolume(0);
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'SoundControl',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    setMute(newVolume === '0' ? true : false);
    sendVolumeData(newVolume);
  };

  const handleMuteToggle = () => {
    let newMute;
    if (volume === 0) {
      newMute = mute;
    } else {
      newMute = !mute;
      if (!mute) {
        setVolume(0);
        sendVolumeData('0');
      }
    }
    setMute(newMute);
    sendMuteData(newMute);
  };

  const sendVolumeData = (newVolume) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'volume',
        value: newVolume,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendMuteData = (newMute) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'mute',
        value: newMute,
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
              <div className='title'>
                <h4>Sound</h4>
              </div>
              <div className="Attribute_Holder">
                <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
                <p>Current volume: {volume}</p>
              </div>
            </td>
            <td className="Attribute" onClick={handleMuteToggle}>
              <div className='title'>
                <h4>Mute</h4>
              </div>
              <div className="Attribute_Holder">
                <input id="muteCheckbox" type="checkbox" style={{ display: 'none' }} />
                <FontAwesomeIcon icon={mute ? faVolumeMute : faVolumeUp} />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default SoundControl;

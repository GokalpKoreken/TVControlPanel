import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DeviceControl.css';

const TimerControl = () => {

  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarms, setAlarms] = useState([]);
  const [isAlarmSet, setIsAlarmSet] = useState(false);

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

        if (data[0].type === 'time') {
            setAlarms(data[0].value);
        }
        
      } catch (error) {
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'ClockControl',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);


  useEffect(() => {
    // Update the current time every second
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      setCurrentTime(time);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleAlarmInputChange = (event) => {
    setAlarmTime(event.target.value);
  };

  const handleSetAlarm = () => {
    setIsAlarmSet(true);
  };

  const handleAddAlarm = () => {
    let newAlarm;
    if (alarmTime === '') {
      newAlarm = {
        id: Date.now(),
        time: new Date().toLocaleTimeString().slice(0, -3)
      };
    } else {
      newAlarm = {
        id: Date.now(),
        time: alarmTime,
      };
    }
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    setAlarmTime('');
    sendAlarms(updatedAlarms);
    setIsAlarmSet(false);
  };
  const sendAlarms = (Alarms) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'time',
        value: Alarms,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const handleDeleteAlarm = (id) => {
    const deletedAlarm = alarms.find((alarm) => alarm.id === id);
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
    setAlarms(updatedAlarms);

    // Send the deleted alarm to the server or trigger an alarm deletion event
    sendDeletedAlarmToServer(deletedAlarm);
  };

  const sendDeletedAlarmToServer = (deletedAlarm) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'deletedAlarm',
        value: deletedAlarm,
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
              <div>
                <h4 className="title">Set Alarm</h4>
              </div>
              <div className="Attribute_Holder">
                {!isAlarmSet ? (
                  <button onClick={handleSetAlarm} className="iphone-button">
                    SET
                  </button>
                ) : (
                  <>
                    <input
                      type="time"
                      value={alarmTime}
                      onChange={handleAlarmInputChange}
                      className="iphone-input"
                    />
                    <button onClick={handleAddAlarm} className="iphone-button">
                      Add Alarm
                    </button>
                  </>
                )}
              </div>
            </td>
            <td className="Attribute">
              <div>
                <h4 className="title">Alarms</h4>
              </div>
              {alarms.length > 0 && (
                <div>
                  <h4>Times:</h4>
                  <Table className="table-dark">
                    <tbody>
                      {alarms.map((alarm) => (  
                        <tr key={alarm.id}>
                          <td className="Time-Holder">
                            {alarm.time}
                            <button
                              className="iphone-button2"
                              onClick={() => handleDeleteAlarm(alarm.id)}
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default TimerControl;

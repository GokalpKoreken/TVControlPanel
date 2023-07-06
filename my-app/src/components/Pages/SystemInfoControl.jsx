import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DeviceControl.css';

const SystemInfoControl = () => {
  const [openSDKVersion, setopenSDKVersion] = useState('');
  const [mainCodeVersion, setmainCodeVersion] = useState('');
  const [boardType, setboardType] = useState('');
  const [CPUtemp,setCPUtemp] = useState('')
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

        if (data[0].type === 'opensdk') {
          setopenSDKVersion(data[0].value)
  
        }
        if (data[1].type === 'maincode') {
          setmainCodeVersion(data[1].value)
 
        }
        if (data[2].type === 'boardtype') {
          setboardType(data[2].value)

        }
        if(data[3].type == 'cputemp')
        {
          setCPUtemp(data[3].value)
        }
      } catch (error) {
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'SystemInfo',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);


 

  return (
    <div className="App">
      <Table className="table-dark">
        <tbody>
          <tr>
            <td className="Attribute">
              <div>
                <h4 className='title'>OpenSDKService Version</h4>
              </div>
              <div className="Attribute_Holder">
                <h5>{openSDKVersion}</h5>
                <label htmlFor="eyeCareCheckbox" />
              </div>
            </td>
            <td className="Attribute" >
              <div>
                <h4 className='title'>Main Code Version</h4>
              </div>
              <div className="Attribute_Holder">
                <h5>{mainCodeVersion}</h5>
                <label htmlFor="wakeOnLANCheckbox" />
              </div>
            </td>
            <td className="Attribute" >
              <div>
                <h4 className='title'>Board Type</h4>
              </div>
              <div className="Attribute_Holder">
                <h5>{boardType}</h5>
                <label htmlFor="wakeOnLANCheckbox" />
              </div>
            </td>
            <td className="Attribute" >
              <div>
                <h4 className='title'>CPU Temperature</h4>
              </div>
              <div className="Attribute_Holder">
                <h5>{CPUtemp}</h5>
                <label htmlFor="wakeOnLANCheckbox" />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default SystemInfoControl
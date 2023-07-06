import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faWifi} from '@fortawesome/free-solid-svg-icons';
import './Configuration.css'; // Import the CSS file for custom styling

const NetworkControl = () => {
  const [networkStatus, setNetworkStatus] = useState(false);
  const [ethernetStatus, setEthernetStatus] = useState(true);
  const [ipAdress,setIpAdress] = useState('')
  const [macAdress,setMacAdress] = useState('')
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

        if (data[0].type === 'NetworkStatus') {
          setNetworkStatus(data[0].value)
  
        }
        if (data[1].type === 'IPAdress') {
          setIpAdress(data[1].value)
 
        }
        if (data[2].type === 'MacAdress') {
          setMacAdress(data[2].value)

        }
        if(data[3].type == 'EthernetStatus')
        {
          setEthernetStatus(data[3].value)
        }
      } catch (error) {
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'NetworkControl',
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
                <h4 className="title">Network Status</h4>
              </div>
              <div className="Attribute_Holder">
                <label htmlFor="networkStatusCheckbox">
                  {networkStatus ? (
                    <FontAwesomeIcon icon={faWifi} />
                  ) : (
                    <FontAwesomeIcon icon={faTimesCircle} />
                  )}
                </label>
              </div>
            </td>
            <td className="Attribute">
              <div>
                <h4 className="title">IP Address</h4>
              </div>
              <div className="Attribute_Holder">
              <h5>{ipAdress}</h5>
                <label htmlFor="powerManagementCheckbox" />
              </div>
            </td>
            <td className="Attribute">
              <div>
                <h4 className="title">Mac Address</h4>
              </div>
              <div className="Attribute_Holder">
              <h5>{macAdress}</h5>
                <label htmlFor="wakeOnLANCheckbox"/>
              </div>
            </td>
            <td className="Attribute">
              <div>
                <h4 className="title">Ethernet Status</h4>
              </div>
              <div className="Attribute_Holder">
                <label htmlFor="ethernetStatusCheckbox">
                  {ethernetStatus ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    <FontAwesomeIcon icon={faTimesCircle} />
                  )}
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default NetworkControl;

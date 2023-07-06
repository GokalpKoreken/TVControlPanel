import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './DeviceControl'; // Import the CSS file for custom styling

const SystemControl = () => {
  const [unknownSources, setUnknownSources] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [languageManagementMenuVisible, setLanguageManagementMenuVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

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

        if (data[0].type === 'unknownSources') {
          setUnknownSources(data[0].value);
        }
        if (data[1].type === 'languages') {
          setLanguages(data[1].value);
        }
      } catch (error) {
        // Handle the error here (e.g., display an error message or fallback behavior)
      }
    };

    const sendDirectoryData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const data = {
          type: 'directory',
          value: 'SystemControl',
        };
        socket.send(JSON.stringify(data));
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = handleSocketMessage;
      sendDirectoryData();
    }
  }, [socket]);

  const sendUnknownSourcesData = (newUnknownSources) => {
    if (socket) {
      const data = {
        type: 'unknownsources',
        value: !unknownSources,
      };
      socket.send(JSON.stringify(data));
    }
  };

  const handleUnknownSourcesToggle = () => {
    setUnknownSources(!unknownSources);
    sendUnknownSourcesData(unknownSources);
  };

  const handleLanguageManagementClick = () => {
    setLanguageManagementMenuVisible(!languageManagementMenuVisible);
  };

  const handleLanguageManagementClickMenu = (language) => {
    setLanguageManagementMenuVisible(!languageManagementMenuVisible);
    sendLanguage(language);
    setSelectedLanguage(language);
  };

  const sendLanguage = (language) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'language',
        value: language,
      };
      socket.send(JSON.stringify(data));
    }
  };
  const sendReboot = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'reboot',
        value: 'do',
      };
      socket.send(JSON.stringify(data));
    }
  };

  const sendPowerOff = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        type: 'poweroff',
        value: 'do',
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
                <h4 className="title">Set Unknown Sources</h4>
              </div>
              <div className="Attribute_Holder">
                <input
                  id="eyeCareCheckbox"
                  type="checkbox"
                  className="switch"
                  checked={unknownSources}
                  onClick={handleUnknownSourcesToggle}
                  readOnly
                />
                <label htmlFor="eyeCareCheckbox" />
              </div>
            </td>
            <td className="Attribute">
              <div>
                <h4 className="title">Language</h4>
              </div>
              <div className="Attribute_Holder" onClick={() => handleLanguageManagementClick('')}>
                <h5>{languageManagementMenuVisible ? '' : selectedLanguage}</h5>
                <label htmlFor="powerManagementCheckbox" />
                <div className="tableWrapper">
                  {languageManagementMenuVisible && (
                    <div className="slide-down-animation-overflow">
                      <Table className="table-dark">
                        <tbody className="Menu">
                          <tr>
                            {languages.length > 0 &&
                              languages.map((language) => (
                                <td
                                  key={language}
                                  className="visible_menu_wrapper"
                                  onClick={() => handleLanguageManagementClickMenu(language)}
                                >
                                  <div>
                                    <h5 className="title">{language}</h5>
                                  </div>
                                </td>
                              ))}
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="Attribute" onClick={sendReboot}>
              <div>
                <h4 className="title">Reboot</h4>
              </div>
              <div className="Attribute_Holder">
                <input id="muteCheckbox" type="checkbox" style={{ display: 'none' }} />
                <FontAwesomeIcon icon={faUndoAlt} />
              </div>
            </td>
            <td className="Attribute" onClick={sendPowerOff}>
              <div>
                <h4 className="title">Power Off</h4>
              </div>
              <div className="Attribute_Holder">
                <input id="muteCheckbox" type="checkbox" style={{ display: 'none' }} />
                <FontAwesomeIcon icon={faPowerOff} />
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default SystemControl;

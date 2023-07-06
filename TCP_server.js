const net = require('net');
const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', ws => {
  console.log('WebSocket client connected');

  // Handle WebSocket messages
  ws.on('message', message => {
    const receivedData = JSON.parse(message);

    // Process the received data based on the communication protocol
    // You'll need to implement the parsing and handling logic here
    console.log('Received data from WebSocket client:', receivedData);
    if (receivedData.type == 'directory') {
      switch (receivedData.value) {
        case 'SoundControl': {
          const soundControlData = [
            {
              type: 'volume',
              value: 65
            },
            {
              type: 'mute',
              value: true
            }
          ];
          ws.send(JSON.stringify(soundControlData));
          break;
        }
        case 'Configuration': {
          const ConfigurationData = 
          [
            {
            type: 'eyecare',
            value: false
            },
            {
              type:'wakeonlan',
              value: false
            }
        ];
          ws.send(JSON.stringify(ConfigurationData));

          break;
        }
        case 'DeviceControl': {
          const deviceControlData = [
            {
              type: 'powermode',
              value: 'Normal Mode'
            },
            {
              type: 'backlight',
              value: true
            },
            {
              type: 'sleep',
              value: 'Off'
            }
          ];
          ws.send(JSON.stringify(deviceControlData));
          break;
        }
        case 'NetworkControl': {
          const networkControlData = [
            {
              type: 'NetworkStatus',
              value: true
            },
            {
              type: 'IPAdress',
              value: '192.158.1.38'
            },
            {
              type: 'MacAdress',
              value: '00-B0-D0-63-C2-26'
            },
            {
              type: 'EthernetStatus',
              value: true
            }
          ];
          ws.send(JSON.stringify(networkControlData));
          break;
        }
        case 'PictureControl': {
          const pictureControlData = [
            {
              type: 'backlight',
              value: 55
            },
            {
              type: 'brightness',
              value: 5
            },
            {
              type: 'sharpness',
              value: 5
            },
            {
              type: 'contrast',
              value: 5
            }
          ];
          ws.send(JSON.stringify(pictureControlData));
          break;
        }
        case 'SourceControl': {
          const sourceControlData = [
            {
              type: 'source',
              value: 'HDMI'
            },
          ];
          ws.send(JSON.stringify(sourceControlData)); 
          break;
        }
        case 'ClockControl': {
          const clockControlData = [
            {
              type: 'time',
              value: 
                  [
                    { id: 1686723858994, time: '09:24' },
                    { id: 1686723858995, time: '09:24' }
                  ]
            },
          ];
          ws.send(JSON.stringify(clockControlData));
          break;
        } 
        case 'SystemControl': {
          const sourceControlData = [
            {
              type: 'unknownSources',
              value: true
            },
            {
              type: 'languages',
              value: ['Turkish','English','French','Turkish','English','French','Turkish','English','French','Turkish','English','French','Turkish','English','French']
            },

          ];
          ws.send(JSON.stringify(sourceControlData));
          break;
        } 
        case 'SystemInfo': {
          const systemInfoData = [
            {
              type: 'opensdk',
              value: '1.8.0_291'
            },
            {
              type: 'maincode',
              value: '1.8.0_291'
            },
            {
              type: 'boardtype',
              value: 'Main Board'
            },
            {
              type: 'cputemp',
              value: '27 °C'
            },

          ];
          ws.send(JSON.stringify(systemInfoData));
          break;
        } 
        // Add additional case statements for other directory values if needed

        default:
          // Code logic for handling other directory values if needed
          break;
      }
    }

    // Send response or additional data to the WebSocket client if required
  });

  // Handle WebSocket disconnection
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

console.log('WebSocket server running on port 4000');

// Create a TCP server
const tcpServer = net.createServer(socket => {
  console.log('TCP client connected');

  // Handle data received from the TCP client
  socket.on('data', data => {
    const receivedData = data.toString();

    // Process the received data based on the communication protocol
    // You'll need to implement the parsing and handling logic here
    console.log('Received data from TCP client:', receivedData);

    // Send response to the TCP client if required
    const response = 'Response to the TCP client';
    socket.write(response);
  });

  // Handle disconnection
  socket.on('end', () => {
    console.log('TCP client disconnected');
  });
});

// Start the TCP server on port 5000
tcpServer.listen(5000, () => {
  console.log('TCP server running on port 5000');
});

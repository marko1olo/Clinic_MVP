import { spawn } from 'node:child_process';
import WebSocket from 'ws';

async function run() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9222', 'http://127.0.0.1:5173/#finance'
  ]);
  
  await new Promise(r => setTimeout(r, 4000));
  
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const targets = await res.json();
  const pageTarget = targets.find(t => t.type === 'page');
  const wsUrl = pageTarget.webSocketDebuggerUrl;
  
  const ws = new WebSocket(wsUrl);
  ws.on('open', () => {
    let id = 1;
    const send = (method, params) => ws.send(JSON.stringify({id: id++, method, params}));
    send('Runtime.enable');
    send('Page.enable');
    send('Log.enable');
    send('Network.enable');
    send('Page.navigate', {url: 'http://127.0.0.1:5173/#finance'});
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if(msg.method === 'Network.responseReceived') {
      if(msg.params.response.status >= 400) {
        console.log('NETWORK_ERROR:', msg.params.response.url, msg.params.response.status);
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 8000));
  browser.kill();
}
run().catch(console.error);

import { spawn } from 'node:child_process';
import WebSocket from 'ws';

async function run() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9222', 'http://127.0.0.1:4100/api/dashboard'
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
    send('Page.navigate', {url: 'http://127.0.0.1:4100/api/dashboard'});
    
    // Evaluate initial app shell variable state
    setTimeout(() => {
        send('Runtime.evaluate', {
            expression: 'document.body.innerText.substring(0, 500)'
        });
    }, 4000);
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if(msg.result?.result?.value !== undefined) {
      console.log('EVAL:', msg.result.result.value);
    }
  });
  
  await new Promise(r => setTimeout(r, 8000));
  browser.kill();
}
run().catch(console.error);

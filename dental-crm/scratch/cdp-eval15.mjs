import { spawn } from 'node:child_process';
import WebSocket from 'ws';

async function run() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--remote-debugging-port=9222', 'http://127.0.0.1:5173/'
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
    
    // Evaluate initial app shell variable state
    setTimeout(() => {
        send('Runtime.evaluate', {
            expression: 'fetch("/api/dashboard").then(r => r.json()).then(d => { window.testPayload = d; console.log("DASHBOARD_OK"); }).catch(e => console.log("FETCH_ERR:", e.message))'
        });
        
        setTimeout(() => {
          send('Runtime.evaluate', {
             expression: 'try { import("/src/useAppLogic.tsx").then(logic => { console.log("LOGIC IMPORTED"); try { import("@dental/shared").then(shared => { console.log("SHARED IMPORTED"); try { shared.dashboardSchema.parse(window.testPayload); console.log("ZOD_OK"); } catch(e) { console.log("ZOD_ERR:", JSON.stringify(e)); } }).catch(e => console.log("SHARED_ERR:", e.message)); } catch(e) { console.log("IMPORT_ERR:", e.message); } }).catch(e => console.log("IMPORT_ERR:", e.message)); } catch(e) { console.log("TRY_ERR:", e.message) }'
          });
        }, 1000);
    }, 4000);
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if(msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.args.map(a => a.value || a.description).join(' '));
    }
  });
  
  await new Promise(r => setTimeout(r, 9000));
  browser.kill();
}
run().catch(console.error);

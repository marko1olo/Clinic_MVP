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
    
    setTimeout(() => {
        send('Page.navigate', {url: 'http://127.0.0.1:5173/'});
        setTimeout(() => {
            send('Runtime.evaluate', {
                expression: '(() => { window.localStorage.setItem("dental-crm:web-ui-preferences:v1", JSON.stringify({ version: 1, selectedWorkspaceRole: "administrator", savedAt: new Date(Date.now() + 100000).toISOString() })); })()'
            });
            setTimeout(() => {
                send('Page.navigate', {url: 'about:blank'});
                setTimeout(() => {
                    send('Page.navigate', {url: 'http://127.0.0.1:5173/#finance'});
                    setTimeout(() => {
                        send('Runtime.evaluate', {
                          expression: '(() => { return { local: window.localStorage.getItem("dental-crm:web-ui-preferences:v1"), financePanel: !!document.querySelector("#finance.finance-panel"), currentViewClass: document.querySelector("#workspace-content")?.className }; })()',
                          returnByValue: true
                        });
                    }, 4000);
                }, 1000);
            }, 1000);
        }, 4000);
    }, 1000);
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if(msg.result?.result?.value !== undefined) {
      console.log('EVAL:', msg.result.result.value);
    }
  });
  
  await new Promise(r => setTimeout(r, 20000));
  browser.kill();
}
run().catch(console.error);

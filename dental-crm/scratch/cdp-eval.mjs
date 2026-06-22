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
    send('Page.navigate', {url: 'http://127.0.0.1:5173/#finance'});
    
    // Now evaluate
    setTimeout(() => {
        send('Runtime.evaluate', {
            expression: 'document.querySelector("#finance") ? document.querySelector("#finance").outerHTML : "NOT_FOUND"'
        })
    }, 4000);
  });
  ws.on('message', data => {
    const msg = JSON.parse(data);
    if(msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.args.map(a => a.value || a.description).join(' '));
    } else if(msg.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    } else if(msg.result?.result?.value) {
      console.log('EVAL_RESULT:', msg.result.result.value);
    }
  });
  
  await new Promise(r => setTimeout(r, 10000));
  browser.kill();
}
run().catch(console.error);

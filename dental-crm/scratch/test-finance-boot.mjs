import CDP from 'chrome-remote-interface';
import { spawn } from 'node:child_process';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--remote-debugging-port=9222',
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);
  await sleep(2000);
  const cdp = await CDP({ port: 9222 });
  try {
    const webBaseUrl = "http://127.0.0.1:11905"; // Assuming the server is running here, wait, I'll use 17551 if needed. Actually, I don't know the port. I will query the open ports. Let me just use fetch to get the port!
  } catch (err) {
    console.error(err);
  } finally {
    await cdp.close();
    browser.kill();
  }
}
main();

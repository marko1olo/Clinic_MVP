import CDP from 'chrome-remote-interface';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const cdp = await CDP({ port: 9222 });
  try {
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:11905/vite.svg' });
    await sleep(2000);
    
    await cdp.send('Runtime.evaluate', {
      expression: 'window.localStorage.setItem("dental-crm:web-ui-preferences:v1", JSON.stringify({ version: 1, selectedWorkspaceRole: "administrator", savedAt: new Date(Date.now() + 100000).toISOString() }))'
    });
    
    await sleep(1000);
    
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:11905/#finance' });
    await sleep(3000);
    
    const result = await cdp.send('Runtime.evaluate', {
      expression: 'JSON.stringify({ raw: window.localStorage.getItem("dental-crm:web-ui-preferences:v1"), currentViewClass: document.querySelector("#workspace-content")?.className })',
      returnByValue: true
    });
    console.log(result.result.value);
  } catch (err) {
    console.error(err);
  } finally {
    await cdp.close();
  }
}
main();

const localtunnel = require('localtunnel');
const fs = require('fs');
const { exec } = require('child_process');

(async () => {
  console.log("🚀 Initializing Global Tunnels for FraudLens...");

  // 1. Tunnel the Backend (Port 8000)
  const backendTunnel = await localtunnel({ port: 8000 });
  console.log(`✅ Backend securely exposed at: ${backendTunnel.url}`);

  // 2. Update Frontend config to use the new public backend URL
  const configContent = `export const API_BASE_URL = '${backendTunnel.url}';\nexport const WS_BASE_URL = '${backendTunnel.url.replace("https", "wss")}';\n`;
  fs.writeFileSync('./src/config.ts', configContent);
  console.log(`🔗 Frontend dynamically wired to public backend.`);

  // 3. Tunnel the Frontend (Port 8080 or 5173 depending on Vite)
  // Assuming the dev server is running on 8080
  const frontendTunnel = await localtunnel({ port: 8080 });
  console.log(`\n========================================================`);
  console.log(`🌐 FRAUDLENS IS NOW LIVE GLOBALLY!`);
  console.log(`🌐 Public URL: ${frontendTunnel.url}`);
  console.log(`========================================================\n`);
  console.log(`NOTE: When someone opens the link, they may need to click 'Continue' to bypass the localtunnel warning screen.`);

  backendTunnel.on('close', () => {
    console.log("Backend tunnel closed");
  });
  frontendTunnel.on('close', () => {
    console.log("Frontend tunnel closed");
  });

})();

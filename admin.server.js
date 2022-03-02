import http from 'http';
import {getAdminRequestListener} from "./lib/admin-server/index.js";

async function startAdminServer(){
  const adminPort = process.env.ADMIN_PORT || 3003
  const adminHost = process.env.ADMIN_HOST || '0.0.0.0'
  const requestListener = await getAdminRequestListener();

  const adminServer = http.createServer(requestListener);
  adminServer.listen(adminPort,adminHost,() => {
    console.log(`\n\t**********************************************************************
    \t\tAdmin Dashboard is listening on http://${adminHost}:${adminPort}
    \t**********************************************************************\n`);
  })
}
startAdminServer();

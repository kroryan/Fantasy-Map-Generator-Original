const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');

let mainWindow;
let server;

function createWindow() {
  // Crear la ventana principal de la aplicación
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'images/icons/icon_x512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    },
    show: false
  });

  // Crear servidor HTTP local
  createLocalServer();
}

function createLocalServer() {
  const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.xml': 'application/xml',
      '.txt': 'text/plain',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.gz': 'application/gzip',
      '.map': 'application/octet-stream'
    };
    return types[ext] || 'application/octet-stream';
  };

  server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    
    // Manejar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(`Error loading file: ${filePath}`, err.message);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      
      const contentType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  server.listen(0, 'localhost', () => {
    const port = server.address().port;
    console.log(`Servidor HTTP iniciado en puerto ${port}`);
    
    // Cargar la aplicación desde el servidor local
    mainWindow.loadURL(`http://localhost:${port}`);
    
    // Mostrar la ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      console.log('Ventana mostrada');
    });

    // Manejar errores de carga
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Error cargando página:', errorCode, errorDescription, validatedURL);
    });

    // Abrir DevTools en modo desarrollo
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  server.on('error', (err) => {
    console.error('Error en el servidor:', err);
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Menú de la aplicación
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nuevo Mapa',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.executeJavaScript('if (typeof generate === "function") generate();');
          }
        },
        {
          label: 'Cargar Mapa',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Archivos de Mapa', extensions: ['map', 'gz'] },
                { name: 'Todos los archivos', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              mainWindow.webContents.executeJavaScript(`if (typeof loadMapFromFile === "function") loadMapFromFile('${filePath}');`);
            }
          }
        },
        {
          label: 'Guardar Mapa',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.executeJavaScript('if (typeof saveMap === "function") saveMap();');
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de Fantasy Map Generator',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Acerca de',
              message: 'Fantasy Map Generator',
              detail: 'Generador de mapas de fantasía por Azgaar\nVersión 1.0.0\n\nAplicación Electron'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Eventos de la aplicación
app.whenReady().then(() => {
  console.log('Electron app ready');
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  
  // Cerrar el servidor cuando se cierre la aplicación
  if (server) {
    server.close(() => {
      console.log('Servidor HTTP cerrado');
    });
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('App quitting');
  // Cerrar el servidor antes de salir
  if (server) {
    server.close(() => {
      console.log('Servidor HTTP cerrado antes de salir');
    });
  }
});

// Prevenir navegación externa
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Permitir navegación local del servidor
    if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
      return;
    }
    
    // Prevenir navegación externa
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Manejo de errores globales
process.on('uncaughtException', (error) => {
  console.error('Error no manejado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});
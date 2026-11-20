const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 820,
    minHeight: 600,
    title: 'Choice of God',
    backgroundColor: '#0b132b',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const bundledPath = path.join(__dirname, 'app', 'index.html');
  const devPath = path.join(__dirname, '..', 'index.html');
  win.loadFile(fs.existsSync(bundledPath) ? bundledPath : devPath);
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

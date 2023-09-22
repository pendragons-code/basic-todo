const { app, BrowserWindow } = require("electron")
const path = require("path")
const url = require("url")

let mainWindow

app.on("ready", () => {
	mainWindow = new BrowserWindow({ 
	    width: 800,
	    height: 600,
	    autoHideMenuBar: true
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file:",
		slashes: true
	}))

	mainWindow.on("closed", () => {
		mainWindow = null
	})
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

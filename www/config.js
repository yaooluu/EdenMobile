var config = {
    developerMode: true,
    debug: true,
    debugNoCommTimeout: false,
    defaults: {
        url: "http://demo.eden.sahanafoundation.org/eden",
        pingPath: "/static/robots.txt",
        loginPath: "/default/user/login"  // TODO: this doesn't work
    },
    mainMenu: [
        {
            name:"Settings",
            page:"page-settings",
            plugin:"settings"
        }
    ],
    plugins: {
        settings: {
            name:"settings",
            config:"config.js"
        }
    },
    version: "0.1.0"
};
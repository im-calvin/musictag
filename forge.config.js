module.exports = {
  packagerConfig: {
    icon: "./public/Music_Tag_v01",
  },
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          nodeIntegration: true,
          entryPoints: [
            {
              name: "main_window",
              html: "./src/index.html",
              js: "./src/renderer.js",
              preload: {
                js: "./src/preload.js",
              },
            },
          ],
        },
      },
    },
  ],
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "im-calvin",
          name: "musictag",
        },
      },
    },
  ],
};

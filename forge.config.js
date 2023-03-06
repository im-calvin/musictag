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
          // nodeIntegration: true,
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
      config: {
        certificateFile: "./cert.pfx",
        certificatePassword: process.env.CERTIFICATE_PASSWORD,
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        background: "./public/Music_Tag_v01.png",
        format: "ULFO",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    // package for debian-linux
    {
      name: "@electron-forge/maker-rpm",
      config: {
        options: {
          maintainer: "Calvin",
          homepage: "https://github.com/im-calvin/musictag",
        },
      },
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

// //const withTM = require('next-transpile-modules')(['@babylonjs']);
// const withTM = require("next-transpile-modules")(["tiu-ui"]); // As per comment.
// const withPlugins = require("next-compose-plugins");

const nextConfig = {
  target: "serverless",
  webpack: function (config) {
    // Svg loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  env: {
    API_URL: "https://vid2strip.herokuapp.com",
  },
};

module.exports = nextConfig;

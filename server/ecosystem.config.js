module.exports = {
  apps: [
    {
      name: "real-estate",
      script: "dist/src/index.js",
      node_args: "--max-old-space-size=384",
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

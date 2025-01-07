module.exports = {
    apps: [
      {
        name: "gplay_api", // Name of the application
        script: "./src/index.js", // Path to your main application file
        instances: "1", // Number of instances (e.g., 1, 2, or 'max' for clustering mode)
        exec_mode: "cluster", // Use 'cluster' for multiple instances or 'fork' for a single instance
        watch: true, // Restart app on file changes
        max_memory_restart: '1G', // Restart the app if memory usage exceeds this value
      },
    ],
  };
  
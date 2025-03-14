module.exports = {
  apps: [
    {
      name: "withbuddy_be_2",
      script: "./build/index.cjs",
      instances: "max",
      exec_mode: "cluster",
      merge_logs: true,
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      output: "~/logs/pm2/console.log",
      error: "~/logs/pm2/consoleError.log",
      // PM2와 Socket.IO를 함께 사용하기 위한 추가 설정
      listen_timeout: 5000, // 프로세스 시작 대기 시간(ms)
      kill_timeout: 3000, // 프로세스 종료 대기 시간(ms)
    },
  ],
};

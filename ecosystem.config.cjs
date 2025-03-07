module.exports = {
  apps: [
    {
      name: "withbuddy_be_2", // PM2 앱 이름
      script: "./build/index.cjs", // 앱 실행 스크립트
      instances: "max", // 클러스터 모드에서 인스턴스를 최대 수로 생성
      exec_mode: "cluster", // 클러스터 모드 실행
      merge_logs: true, // 로그 파일을 합쳐서 출력
      autorestart: true, // 프로세스가 실패할 경우 자동 재시작
      watch: true, // 파일 변경 시 자동 재시작
      ignore_watch: ["node_modules", "logs"], // 변경을 무시할 디렉토리
      max_memory_restart: "512M", // 메모리가 512MB 이상일 경우 재시작
      env: {
        NODE_ENV: "production", // 프로덕션 환경 설정
      },
      output: "~/logs/pm2/console.log", // 표준 출력 로그 파일 경로
      error: "~/logs/pm2/consoleError.log", // 에러 출력 로그 파일 경로
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'sinema',
      cwd: './projects/sinema',
      script: 'npm',
      args: 'start',
      watch: true,
    },
    {
      name: 'habari',
      cwd: './projects/habari/server',
      script: 'npm',
      args: 'start',
      watch: true,
    },
    {
      name: 'mtandao',
      cwd: './projects/mtandao/server',
      script: 'npm',
      args: 'start',
      watch: true,
    },
  ],
};

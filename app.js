const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('GitHubのユーザー名を入力してください：', (input) => {
  const githubUsername = input.trim();

  if (!githubUsername) {
    console.log('GitHubのユーザー名が入力されていません。');
    rl.close();
    return;
  }

  console.log(githubUsername);
  rl.close();
});
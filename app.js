const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fetchGitHubUser(username) {
  const encodedUsername = encodeURIComponent(username);
  const url = `https://api.github.com/users/${encodedUsername}`;
  const response = await axios.get(url, { timeout: 10000 });
  const user = response.data;

  console.log(`ユーザー名: ${user.login}`);
  console.log(`名前: ${user.name || '未設定'}`);
  console.log(`自己紹介: ${user.bio || '未設定'}`);
  console.log(`公開リポジトリ数: ${user.public_repos}`);
  console.log(`フォロワー数: ${user.followers}`);
  console.log(`フォロー数: ${user.following}`);
  console.log(`プロフィールURL: ${user.html_url}`);
}

rl.question('GitHubのユーザー名を入力してください：', async (input) => {
  const githubUsername = input.trim();

  if (!githubUsername) {
    console.log('GitHubのユーザー名が入力されていません。');
    rl.close();
    return;
  }

  try {
    await fetchGitHubUser(githubUsername);
  } catch (error) {
    console.error('GitHubユーザー情報の取得に失敗しました:', error.message);
  } finally {
    rl.close();
  }
});

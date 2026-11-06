const readline = require('readline');
const axios = require('axios');

// GitHub APIからユーザー情報を取得する
async function fetchGitHubUser(username, httpClient = axios) {
  const encodedUsername = encodeURIComponent(username);
  const url = `https://api.github.com/users/${encodedUsername}`;
  const response = await httpClient.get(url, { timeout: 10000 });
  return response.data;
}

// GitHub APIのエラーを利用者向けのメッセージに変換する
function getApiErrorMessage(error) {
  if (error.response?.status === 403) {
    return 'GitHub APIへのアクセスが拒否されました（利用制限の可能性があります）。';
  }
  if (error.response?.status === 429) {
    return 'GitHub APIのリクエスト上限に達しました。時間をおいて再試行してください。';
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'GitHub APIへの接続がタイムアウトしました。';
  }
  return `GitHubユーザー情報の取得に失敗しました: ${error.message}`;
}

// ユーザー情報を見やすく表示する
function displayUser(user) {
  console.log(`ユーザー名: ${user.login}`);
  console.log(`名前: ${user.name || '未設定'}`);
  console.log(`自己紹介: ${user.bio || '未設定'}`);
  console.log(`公開リポジトリ数: ${user.public_repos}`);
  console.log(`フォロワー数: ${user.followers}`);
  console.log(`フォロー数: ${user.following}`);
  console.log(`プロフィールURL: ${user.html_url}`);
}

// 入力を受け取り、ユーザー情報取得から表示までを実行する
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('GitHubのユーザー名を入力してください：', async (input) => {
    const githubUsername = input.trim();

    if (!githubUsername) {
      console.log('GitHubのユーザー名が入力されていません。');
      rl.close();
      return;
    }

    try {
      const user = await fetchGitHubUser(githubUsername);
      displayUser(user);
    } catch (error) {
      console.error(getApiErrorMessage(error));
    } finally {
      rl.close();
    }
  });
}

// このファイルが直接実行された場合にアプリを起動する
if (require.main === module) {
  main();
}

// テストから利用する関数を公開する
module.exports = { fetchGitHubUser, getApiErrorMessage };

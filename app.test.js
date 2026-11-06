const assert = require('node:assert/strict');
const test = require('node:test');
const { fetchGitHubUser, getApiErrorMessage } = require('./app');

test('fetches a user with an encoded username and a 10-second timeout', async () => {
  let request;
  const expectedUser = { login: 'user/name' };
  const httpClient = {
    get: async (...args) => {
      request = args;
      return { data: expectedUser };
    }
  };

  const user = await fetchGitHubUser('user/name', httpClient);

  assert.deepEqual(user, expectedUser);
  assert.deepEqual(request, [
    'https://api.github.com/users/user%2Fname',
    { timeout: 10000 }
  ]);
});

test('reports a 403 response', () => {
  assert.match(
    getApiErrorMessage({ response: { status: 403 } }),
    /アクセスが拒否/
  );
});

test('reports a 429 response', () => {
  assert.match(
    getApiErrorMessage({ response: { status: 429 } }),
    /リクエスト上限/
  );
});

test('reports an axios timeout', () => {
  assert.match(
    getApiErrorMessage({ code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' }),
    /タイムアウト/
  );
});

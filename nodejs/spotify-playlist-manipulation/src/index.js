const express = require('express');
const fs = require('fs');
const https = require('https');

const rawConstants = fs.readFileSync('constants.json');
const constants = JSON.parse(rawConstants.toString());

const app = express();

const token = Buffer.from(
  `${constants.SpotifyClientId}:${constants.SpotifySecret}`
).toString('base64');

const getAccessToken = async (code) => {
  return new Promise((resolve, reject) => {
    let data = '';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const request = https.request('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    request.on('data', (response) => {
      data += response;
    });
    request.on('close', () => resolve(data));
    request.on('error', reject);
    request.end();
  });
};

app.get('/authenticate', (_, res) => {
  const scopes =
    'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
  const params = [
    `client_id=${constants.SpotifyClientId}`,
    `redirect_uri=${encodeURIComponent(constants.RedirectURL)}`,
    'response_type=code',
    `scope=${encodeURIComponent(scopes)}`,
    'show_dialog=true',
  ];
  const authUri = `https://accounts.spotify.com/authorize?${params.join('&')}`;
  res.redirect(authUri);
});

app.get('/authentication/callback', async (req, res) => {
  const { code } = req.query;
  const accessToken = await getAccessToken(code);
  console.log(accessToken);
  res.send(accessToken);
});

app.get('*', (req, res) => {
  res.send('Hello, World');
});

app.listen(8080);

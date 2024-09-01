/*
** X integration is temporarily removed
*/

// import crypto from 'node:crypto';
// import OAuth from 'oauth-1.0a';

// import { environment } from '../../env';

// export async function tweet(tw: string): Promise<global.Response> {
//   const method = 'POST';
//   const url = 'https://api.twitter.com/2/tweets';

//   return fetch(url, {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': buildOAuth(method, url),
//     },
//     body: JSON.stringify({
//       text: tw,
//     }),
//     redirect: 'follow'
//   });
// }

// function buildOAuth(method: string, url: string): string {
//   console.log(environment);
//   const oauth = new OAuth({
//     consumer: { key: environment.TWITTER_CONSUMER_KEY, secret: environment.TWITTER_CONSUMER_KEY_SECRET },
//     signature_method: 'HMAC-SHA1',
//     hash_function(base_string, key) {
//         return crypto
//             .createHmac('sha1', key)
//             .update(base_string)
//             .digest('base64')
//     },
//   });

//   return oauth.toHeader({
//     ...oauth.authorize({
//       method,
//       url,
//     }, {
//       key: environment.TWITTER_ACCESS_TOKEN,
//       secret: environment.TWITTER_ACCESS_TOKEN_SECRET
//     }),
//   }).Authorization
// }


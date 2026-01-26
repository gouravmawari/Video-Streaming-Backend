const crypto = require('crypto');
const SECRET = process.env.STREAM_SECRET;

function verifyStreamToken(token) {
  if (!token) {
    throw new Error('Token missing');
  }

  const [data, signature] = token.split('.');

  if (!data || !signature) {
    throw new Error('Malformed token');
  }

  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('hex');

  if (signature !== expectedSig) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(
    Buffer.from(data, 'base64').toString('utf-8')
  );

  if (Date.now() > payload.exp) {
    throw new Error('Token expired');
  }

  return payload;
}

module.exports = verifyStreamToken;

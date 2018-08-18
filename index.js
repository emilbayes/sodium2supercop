var sodium = require('sodium-universal')

module.exports = function (sk, pk) {
  var secretKey = Buffer.alloc(64)

  sodium.crypto_hash_sha512(secretKey, sk.subarray(0, 32))
  // clamping
  secretKey[0] &= 248
  secretKey[31] &= 63 // equiv. to secretKey[31] &= 127 since the 7th bit is set high in the next line
  secretKey[31] |= 64

  return {
    secretKey,
    publicKey: Buffer.from(pk)
  }
}

var sodium = require('sodium-native')
var sc = require('ed25519-supercop')
var assert = require('assert')

var seed = Buffer.alloc(32)
var hash = Buffer.alloc(64)

var naSk = Buffer.alloc(64)
var naPk = Buffer.alloc(32)

var naSig = Buffer.alloc(sodium.crypto_sign_BYTES)

var msg = Buffer.from('hello world')

for (var i = 0; i < 1e4; i++) {
  try {
    loop()
  } catch (err) {
    console.log(seed)
    console.error(err)
    process.exit(1)
  }
}

function loop () {
  sodium.randombytes_buf(seed)

  sodium.crypto_sign_seed_keypair(naPk, naSk, seed)
  var keypair = sc.createKeyPair(seed)

  assert(keypair.publicKey.equals(naPk), 'same public key encodings')
  sodium.crypto_hash_sha512(hash, seed)
  hash[0] &= 248
  hash[31] &= 63
  hash[31] |= 64

  assert(keypair.secretKey.equals(hash), 'supercop sk is sha512(libsodium sk)')

  sodium.crypto_sign_detached(naSig, msg, naSk)
  var scSig = sc.sign(msg, keypair.publicKey, keypair.secretKey)

  assert(naSig.equals(scSig), 'equivalent sigs')

  var xSig = sc.sign(msg, naPk, hash)
  assert(xSig.equals(naSig), 'supercop can sign with libsodium keys')

  assert(sc.verify(naSig, msg, naPk))
  assert(sc.verify(naSig, msg, keypair.publicKey))
  assert(sc.verify(xSig, msg, naPk))
  assert(sc.verify(xSig, msg, keypair.publicKey))
  assert(sodium.crypto_sign_verify_detached(scSig, msg, naPk))
  assert(sodium.crypto_sign_verify_detached(scSig, msg, keypair.publicKey))
  assert(sodium.crypto_sign_verify_detached(xSig, msg, naPk))
  assert(sodium.crypto_sign_verify_detached(xSig, msg, keypair.publicKey))
}

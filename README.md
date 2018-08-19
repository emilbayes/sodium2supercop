# `sodium2supercop`

> Convert libsodium key pairs to ed25519-supercop key pairs

## Usage

```js
var s2s = require('sodium2supercop')
var ed = require('ed25519-supercop')

var sk = // Buffer ...
var pk = // Buffer ...

var keypair = s2s(sk, pk)

// Now you can used your sodium keys with supercop
var msg = Buffer.from('Hello world!')
var signature = ed.sign(msg, keypair.publicKey, keypair.secretKey)

ed.verify(signature, msg, keypair.publicKey)
```

Note that this transformation is one-way, ie. you cannot convert supercop keys
to libsodium compatible keys.

## API

### `var {publicKey, secretKey} = convert(secretKeyBuf, publicKeyBuf)`

Convert libsodium generated `secretKeyBuf` and `publicKeyBuf` to
a `ed25519-supercop` compatible key pair. This will put `secretKeyBuf` though
a one-way transformation and copy the `publicKeyBuf` into a new `Buffer` for
`publicKey`.

## Install

```sh
npm install sodium2supercop
```

## License

[ISC](LICENSE)

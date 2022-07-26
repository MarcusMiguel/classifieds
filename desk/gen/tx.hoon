::  ethereum.request({method: 'personal_sign', params: ['tx',count]}).then(console.log)
::  ethereum.request({method: 'eth_sendTransaction', params: [{from: count, gasPrice: '0x2540be400', to: '0xb58101cd3bbbcc6fa40bcdb04bb71623b5c7d39b', gas: '0x10000', data: 'batch', chainId: '0x3'}]}).then(console.log)
::
/+  eth=ethereum
/=  tt  /tests/lib/naive
|%
::  Generated by running these commands after modifying eth-sig-util
::  such that TypedDataUtils.sign returns the domain separator instead
::  of continuing to sign.  I think this is basically EIP-712
::  compatible, but it also doesn't matter much because we're not
::  compatible with the whole EIP anyway.  The main thing is to be
::  distinct from other names, versions, and chainIds.
::
::  Alter chainId as necessary
::
::  sig = require('eth-sig-util')
::  domain = [{ name: "name", type: "string" },{ name: "version", type: "string" },{ name: "chainId", type: "uint256" }]
::  domainData = {name: "Urbit", version: "1", chainId: 0x1}
::  sig.TypedDataUtils.sign({domain: domainData, types: {EIP712Domain: domain}, primaryType: 'EIP712Domain'}, true).toString('hex')
::
++  domain-separator   ropsten-separator
++  mainnet-separator
  0x30e4.9840.ca87.cf16.b969.f49e.4b8d.488f.
    08a6.88f9.43f5.b07e.7671.6c0d.b2fb.b44b
++  ropsten-separator
  0x77e7.083f.92f9.321e.0a71.a78d.238a.a25a.
    5689.19d4.6a58.abf6.7bed.2c83.80e1.8692
::
++  print-for-web3
  |=  =octs
  ^-  @t
  =/  txt  (crip (render-hex-bytes:eth octs))
  ?>  =(p.octs (met 4 txt))
  (cat 3 '0x' (rev 4 (met 4 txt) txt))
::
++  print-for-batch
  |=  =octs
  ^-  @t
  (crip (render-hex-bytes:eth octs))
--
|=  sig=(unit @t)
^-  @t
=/  account  (hex-to-num:eth '0xb026b0AA6e686F2386051b31A03E5fB95513e1c0')
=/  tx=octs
  (gen-tx-octs:tt [~ravmun-mitbus %own] %set-spawn-proxy account)
=/  prepped=octs  (prepare-for-sig:tt 3 0 tx)
?~  sig
  (cat 3 'sign: ' (print-for-web3 prepped))
=/  batch=@t
  %:  rap  3
    '0x26887f26'
    (print-for-batch tx)
    (rsh 3^2 u.sig)
    ~
  ==
(cat 3 'batch: ' batch)

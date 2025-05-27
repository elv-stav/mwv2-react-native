const main = {
  /* Main */
  name: "main",
  prettyName: "Main",
  baseUrl: "https://main.net955305.contentfabric.io/s/main/",
  configUrl: "https://main.net955305.contentfabric.io/config",
  walletUrl: "https://wallet.contentfabric.io",
  // This doesn't have to be pre-generated.
  // once we fetch the config, this is just a base64 encoding of:
  // {"qspace_id": "${config.qspace.id}"}
  staticToken: "eyJxc3BhY2VfaWQiOiAiaXNwYzJSVW9SZTllUjJ2MzNIQVJRVVZTcDFyWVh6dzEifQ==",
}

const demo = {
  name: "demov3",
  prettyName: "Demo",
  baseUrl: "https://demov3.net955210.contentfabric.io/a/demov3/",
  configUrl: "https://demov3.net955210.contentfabric.io/config",
  walletUrl: "https://wallet.demov3.contentfabric.io",
  staticToken: "eyJxc3BhY2VfaWQiOiAiaXNwYzNBTm9WU3pOQTNQNnQ3YWJMUjY5aG81WVBQWlUifQ==",
}

// The only reason we don't export the object directly is to not
// allow code to reference "main" or "demo" directly.
export default { ...main };
// export default { ...demo };

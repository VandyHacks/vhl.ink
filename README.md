# vhl.ink

Custom link shortener service using Cloudflare Workers + KV store on your domain. The Workers free tier is quite generous and perfectly suited for this since KV is optimized for high reads and infrequent writes, which is our use case. 

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/VandyHacks/vhl.ink)

This API is easily consumed programmatically, such as through shell functions or slack slash commands, making it trivial to shorten links on the fly.

Additionally, it is possible to make a simple form to create short links right from a webpage if that is more to your liking. See this [example](https://developers.cloudflare.com/workers/examples/read-post) for more info on that.

## Usage

### Creating short links
send POST request with form data `url` and `path` to redirect vhl.ink/path to url.

for authentication, pass a secret key in a `x-preshared-key` header.

if `path` exists already, the value will be overwritten (feature, not a bug).

#### API Example

```bash
curl --location --request POST "https://vhl.ink" \
    -H "x-preshared-key: your secret key goes here" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "url=$URL" \
    --data-urlencode "path=$NAME"
```
passing https://github.com/VandyHacks to url, and gh to path will make https://vhl.ink/gh redirect to it (this is a real example).

### Deleting short links

Send DELETE request to the shortlink which should be deleted.

Authentication is required; pass the secret key in the `x-preshared-key` header.

This method is idempotent, being that successive attempts to delete an already-deleted shortlink
will result in status 200 (OK).

#### API Example

```bash
curl --location --request DELETE "https://vhl.ink/gh" \
    -H "x-preshared-key: ${SECRET_KEY}"
```

Will delete the shortlink available at https://vhl.ink/gh

### Listing short links

Sending an authenticated GET request to the vhl.ink domain root will respond with a list of all
shortlinks maintained by the service.

Authentication is required; pass the secret key in the `x-preshared-key` header.

#### API Example

```bash
curl --location --request GET "https://vhl.ink" \
    -H "x-preshared-key: ${SECRET_KEY}"
```

Will return a JSON array of keys with one to three properties:

```json
  [{ name: "gh", expiration: null, metadata: "https://github.com/VandyHacks/vaken"}, ...]
```
(From https://developers.cloudflare.com/workers/runtime-apis/kv#more-detail)

`expiration` and `metadata` are optional.

### Consuming

this is the easy part, simply open the shortened link in your browser of choice! 

## Deploying

Automatically deploys to Cloudflare Workers on push using GitHub Actions. You will only need to modify the account and kv namespace values in [wrangler.toml](wrangler.toml), and set the repo secrets `CF_API_TOKEN` and `SECRET_KEY` (this is the preshared header authentication key) used in the [workflow](.github/workflows/main.yml). 

Oh, and run the worker on the route you want your shortener service to be on of course.

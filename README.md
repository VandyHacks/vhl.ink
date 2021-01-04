# vhl.ink

Custom link shortener service using Cloudflare Workers + KV store on your domain. The Workers free tier is quite generous and perfectly suited for this since KV is optimized for high reads and infrequent writes, which is our use case. 

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

### Consuming

this is the easy part, simply open the shortened link in your browser of choice! 

## Deploying

This repo is set to automatically deploy to Cloudflare Workers on push. You will only need to modify the account values in [`wrangler.toml`](wrangler.toml), and set the repo secrets `CF_API_TOKEN` and `SECRET_KEY` (this is the preshared header authentication key) used in the [workflow](.github/workflows/main.yml). 

Oh, and run the worker on the route you want your shortener service to be on of course.

addEventListener('fetch', event => {
  const { request } = event;

  if (request.method === "POST")
    return event.respondWith(handlePOST(request))

  return event.respondWith(handleRequest(request))
})

const html = `<!DOCTYPE html>
<body>
    <pre>
    use an actual path if you're trying to fetch something.
    send a POST request with form data "url" and "path" if you're trying to put something.
    set x-preshared-key header for authentication.
    
    source: <a href="https://github.com/VandyHacks/vhl.ink">VandyHacks/vhl.ink</a>
    </pre>
</body>`

/**
 * Respond to POST requests with shortened URL creation
 * @param {Request} request
 */
async function handlePOST(request) {
  const psk = request.headers.get("x-preshared-key");
  if (psk !== SECRET_KEY)
    return new Response("Sorry, bad key.", {status: 403})

  const shortener = new URL(request.url);
  const data = await request.formData();
  const redirectURL = data.get("url");
  const path = data.get("path");

  if (redirectURL === null || path === null) 
    return new Response("`url` and `path` need to be set.", {status: 400});

  // will overwrite current path if it exists
  await LINKS.put(path, redirectURL);
  return new Response(`${redirectURL} available at ${shortener}${path}`, {status: 201});
}

/**
 * Respond to GET requests with redirects
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.split("/")[1];
  if (path === "") 
    return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }})
 
  const redirectURL = await LINKS.get(path);
  if (redirectURL) 
    return Response.redirect(redirectURL, 301);

  return new Response("URL not found. Sad!", {status: 404});
}

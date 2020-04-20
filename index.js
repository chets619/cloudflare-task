let links;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  let urlLists = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");

  links = await urlLists.json();

  return fetch(links.variants[Math.floor(Math.random() * 2)]);
}

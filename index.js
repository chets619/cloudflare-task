let links;

class ElementHandler {
  element(element) {
    if (element.tagName == 'title')
      element.setInnerContent("Cloudflare Task")
    else if (element.getAttribute('id') == "description")
      element.setInnerContent("This is a sample description modified via ElementHandler class");
    else if (element.getAttribute('id') == "title")
      element.setInnerContent("Cloudflare Fullstack Internship Task!");
    else if (element.getAttribute('id') == "url")
      element.setInnerContent("Check My LinkedIn!");
  }
}

class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName;
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName);
    if (attribute)
      element.setAttribute(this.attributeName, attribute.replace('https://cloudflare.com', 'https://www.linkedin.com/in/chets619/'));
  }
}

let rewriter = new HTMLRewriter()
  .on('h1#title', new ElementHandler())
  .on('p#description', new ElementHandler())
  .on('title', new ElementHandler())
  .on('a#url', new AttributeRewriter("href"))
  .on('a#url', new ElementHandler());

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let cookie = request.headers.get('Cookie'),
    variant,
    urlLists = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");

  console.log('cookie', cookie)
  links = await urlLists.json();

  if (cookie && cookie.includes('VARIANT_NO=0')) {
    console.log("In 0")
    variant = 0;
  } else if (cookie && cookie.includes('VARIANT_NO=1')) {
    console.log("In 1")
    variant = 1;
  } else {
    variant = Math.floor(Math.random() * 2);
  }

  let response = await fetch(links.variants[variant]);

  response.headers.append("Set-Cookie", `VARIANT_NO=${variant}; path=/;`);

  return rewriter.transform(response);
}

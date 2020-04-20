let links;

class ElementHandler {
  element(element) {
    // An incoming element, such as `div`
    console.error(`Incoming element: ${element.tagName}`)

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
    if (this.attributeName == "href")
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

  let urlLists = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");

  links = await urlLists.json();
  let a = await fetch(links.variants[Math.floor(Math.random() * 2)]);
  return rewriter.transform(a);
}

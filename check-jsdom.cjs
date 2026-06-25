const { JSDOM } = require("jsdom");
JSDOM.fromURL("https://zoneparquet.vercel.app/", { runScripts: "dangerously", resources: "usable" }).then(dom => {
  console.log("Loaded dom");
  setTimeout(() => {
    const products = dom.window.document.querySelectorAll('.product-card');
    console.log("Found product cards:", products.length);
    console.log(dom.window.document.body.innerHTML.substring(0, 500));
  }, 5000);
}).catch(console.error);

import { getPage } from "vite-plugin-ssr/client";
import { createApp } from "./app.js";

try {
  hydrate().then(ignored => {});
} catch (e) {
  console.error(e);
}

async function hydrate() {
  const pageContext = await getPage();
  const app = createApp(pageContext);
  app.mount("#app");
}

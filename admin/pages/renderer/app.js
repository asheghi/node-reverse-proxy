import { createSSRApp, defineComponent, h } from "vue";
import {setPageContext} from "../../lib/plugins/usePageContext.js";
export { createApp };

import '../../assets/styles/tailwind.css'

function createApp(pageContext) {
  const { Page, pageProps } = pageContext;
  const PageComponent = defineComponent({
    render() {
      return h(Page, pageProps || {});
    },
  });

  const app = createSSRApp(PageComponent);
  setPageContext(app, pageContext);

  return app;
}

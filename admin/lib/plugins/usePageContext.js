import { inject } from "vue";
export { usePageContext };
export { setPageContext };

export const pageContextKey = Symbol();

function usePageContext() {
  const pageContext = inject(pageContextKey);
  return pageContext;
}

function setPageContext(app, pageContext) {
  app.provide(pageContextKey, pageContext);
}

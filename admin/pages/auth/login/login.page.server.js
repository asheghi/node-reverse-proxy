import db from "../../../../lib/database";

export async function onBeforeRender() {
  const hasSetup = db.users.length;
  if (!hasSetup) {
    return {
      pageContext: {
        redirect: '/setup',
      },
    };
  }
  return null;
}

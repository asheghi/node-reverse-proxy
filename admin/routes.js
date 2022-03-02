export const AdminRoutes = [
  {
    name: 'home',
    path: '/',
  }
]

export function getRouteByName(arg){
  //todo make it nested!
  return AdminRoutes.find(it => it.name === arg);
}

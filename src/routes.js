import React from 'react'

const Nftstaking = React.lazy(() => import('./views/nftstaking/Nftstaking'))
const FTstaking = React.lazy(() => import('./views/ftstaking/FTstaking'))
const Info = React.lazy(() => import('./views/info/Info'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/nftstaking', name: 'Nftstaking', element: Nftstaking },
  { path: '/ftstaking', name: 'FTstaking', element: FTstaking },
  { path: '/info', name: 'Info', element: Info },
  { path: '/forms/range', name: 'Range', element: Range },
]

export default routes

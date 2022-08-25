import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilInfo, cilPuzzle } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'STAKING',
  },
  {
    component: CNavItem,
    name: 'NFT Staking',
    to: '/nftstaking',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'sDood Staking',
    to: '/ftstaking',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'INFO',
  },
  {
    component: CNavItem,
    name: 'Information',
    to: '/info',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'MARKETPLACE',
  },
  {
    component: CNavItem,
    name: 'NFT MarketPlace',
    to: '/nftmarket',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" disabled />,
  },
]

export default _nav

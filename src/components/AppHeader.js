import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderBrand, CHeaderNav, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import Logo from '../assets/images/newlogo.png'

import '../scss/style.scss'
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <img
            className="sidebar-brand-full text-body"
            src={Logo}
            alt="logo"
            style={{ width: '100%', height: '55px' }}
          />
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <a className="btn-website" href="https://doodcats.com">
            Website
          </a>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

import React from 'react'
import { CCard, CCol, CRow } from '@coreui/react'

const Info = () => {
  return (
    <>
      <CCard className="p-5">
        <CRow className="align-items-start">
          <CCol className="infoContain-topbar">Staking Pool</CCol>
        </CRow>
        <CRow className="align-items-start">
          <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
            {' '}
            <h1>SDOOD Supply</h1>
            <p>0</p>
          </CCol>
          <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
            {' '}
            <h1>NFT Total Staked</h1>
            <p>0</p>
          </CCol>
          <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
            {' '}
            <h1>My Staked</h1>
            <p>0</p>
          </CCol>
        </CRow>
        <CRow className="align-items-start">
          <CCol lg={4} xs={12} sm={12} md={12} className="infoContain">
            <h1>SDOOD Burn</h1>
            <p>0</p>
          </CCol>
          <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
            <h1>SDOOD</h1>
            <p>0</p>
          </CCol>
        </CRow>
      </CCard>
    </>
  )
}

export default Info

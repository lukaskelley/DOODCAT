import React from 'react'
import { CRow, CCol, CCard } from '@coreui/react'
import '../../scss/custom.scss'
const FTstaking = () => {
  return (
    <CCard className="p-5">
      <CRow className="align-items-start">
        <CCol className="toptitleContainer">
          <h1>Welcome to sDOOD Staking Portal COMING SOON</h1>
          <p>
            sDOOD Token is a utility token for the DoodCats and will be used on future projects.
            Stake your sDood and earn up to 25%
          </p>
        </CCol>
      </CRow>
      <CRow className="align-items-start">
        <CCol className="infoContain-topbar">FT STAKING</CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          {' '}
          <h1>STAKING OPTION - A</h1>
          <p>- 30 Days Lock period</p>
          <p>- 0% Fees apply</p>
          <p>- 5% Coin on release</p>
          <p>- Early release fee 3.5%</p>
          <input type="number" className="ftstakingInput"></input>
          <button className="ftstakeBtn">Stake</button>
        </CCol>

        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          {' '}
          <h1>STAKING OPTION - B</h1>
          <p>- 60 Days Lock period</p>
          <p>- 0% Fees apply</p>
          <p>- 10% Coin on release</p>
          <p>- Early release fee 3.5%</p>
          <input type="number" className="ftstakingInput"></input>
          <button className="ftstakeBtn">Stake</button>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol lg={4} xs={12} sm={12} md={12} className="infoContain">
          <h1>STAKING OPTION - C</h1>
          <p>- 90 Days Lock period</p>
          <p>- 0% Fees apply</p>
          <p>- 15% Coin on release</p>
          <p>- Early release fee 5.5%</p>
          <input type="number" className="ftstakingInput"></input>
          <button className="ftstakeBtn">Stake</button>
        </CCol>
        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          <h1>STAKING OPTION - D</h1>
          <p>- 120 Days Lock period</p>
          <p>- 0% Fees apply</p>
          <p>- 25% Coin on release</p>
          <p>- Early release fee 5.5%</p>
          <input type="number" className="ftstakingInput"></input>
          <button className="ftstakeBtn">Stake</button>
        </CCol>
      </CRow>
    </CCard>
  )
}

export default FTstaking

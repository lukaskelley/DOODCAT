import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow } from '@coreui/react'
import abi from '../../assets/abi/abi.json'
import sdood from '../../assets/abi/sdood.json'

import config, { NFTStakingAddress } from '../../config/config'
import nftStakingABI from '../../assets/abi/nftStakingABI.json'

const ethers = require('ethers')
const Info = () => {
  useEffect(() => {
    updateEthers()
    getInfo()
  }, [])
  // useState provider null
  const [provider, setProvider] = useState(null)
  // useState contract null
  const [nftContract, setNftContract] = useState(null)
  // useState nftStaking Contract null
  const [nftStakingContract, setNftStakingContract] = useState(null)
  // useState SDOOD Contract null
  const [sDooDContract, setSDOODContract] = useState(null)
  // useState signer null
  const [signer, setSigner] = useState(null)
  // usestate currentTier 0
  const [currentTier, setCurrentTier] = useState(0)
  // usestate currentMyStakedCount 0
  const [currentMyStakedCount, setCurrentMyStakedCount] = useState(0)
  // usestate currentTotalStakedCount 0
  const [currentTotalStakedCount, setCurrentTotalStakedCount] = useState(0)
  // usestate currentTotalBurn 0
  const [currentTotalBurn, setCurrentTotalBurn] = useState(0)
  // usestate currentSDOOD 0
  const [currentSDOOD, setCurrentSDOOD] = useState(0)
  // usestate currentSdoodBalance 0
  const [currentSDoodBalance, setCurrentSDoodBalance] = useState(0)
  // usestate currentBurn 0
  const [currentBurn, setCurrentBurn] = useState(0)
  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    let tempSigner = tempProvider.getSigner()
    // Get NFT contract
    let nftContract = new ethers.Contract(config.NFTAddress, abi, tempSigner)
    setNftContract(nftContract)
    //Get New NFT staking contract
    let nftStakingContract = new ethers.Contract(
      config.NFTStakingAddress,
      nftStakingABI,
      tempSigner,
    )
    setNftStakingContract(nftStakingContract)
    //Get New sDOOD Token contract
    let sDoodContract = new ethers.Contract(config.sDoodAddress, sdood, tempSigner)
    setSDOODContract(sDoodContract)
    // console.log(nftStakingContract);
  }
  const getInfo = () => {
    let TotalstakedNFT = localStorage.getItem('TotalstakedNFT')
    let mystakedNFT = localStorage.getItem('MystakedNFT')
    let sdoodBalance = localStorage.getItem('sdoodBalance')
    let sdoodBurn = localStorage.getItem('sdoodBurn')
    setCurrentMyStakedCount(mystakedNFT)
    setCurrentSDOOD(TotalstakedNFT)
    setCurrentSDoodBalance(sdoodBalance)
    setCurrentBurn(sdoodBurn)
  }

  return (
    <CCard className="infoContainer p-5">
      <CRow className="align-items-start">
        <CCol className="infoContain-topbar">Staking Pool</CCol>
      </CRow>
      <CRow className="align-items-start">
        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          {' '}
          <h1>My sDOOD Supply</h1>
          <p>{currentSDoodBalance}</p>
        </CCol>
        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          {' '}
          <h1>Total sDOOD Staked</h1>
          <p>{currentTotalStakedCount}</p>
        </CCol>
        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          {' '}
          <h1>My NFTs Staked</h1>
          <p>{currentMyStakedCount}</p>
        </CCol>
      </CRow>
      <CRow className="align-items-start">
        <CCol lg={4} xs={12} sm={12} md={12} className="infoContain">
          <h1>Total sDOOD Burn</h1>
          <p>{currentBurn}</p>
        </CCol>
        <CCol lg={4} xs={23} sm={12} md={12} className="infoContain">
          <h1>Total DoodCats Staked</h1>
          <p>{currentSDOOD}</p>
        </CCol>
      </CRow>
    </CCard>
  )
}

export default Info

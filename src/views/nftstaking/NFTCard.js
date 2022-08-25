import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// import sdood from '../../assets/abi/sdood.json'

import config from '../../config/config'
import nftStakingABI from '../../assets/abi/nftStakingABI.json'

import '../../scss/custom.scss'

const ethers = require('ethers')

const CardContainer = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgb(25 19 38 / 70%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  justify-content: center;
  border-radius: 20px;
  padding: 20px;
  gap: 5px;
  background: white;
`

const Image = styled.img`
  box-shadow: rgb(25 19 38 / 70%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  width: 100px;
  height: 100px;
  border-radius: 20px;
`

const Button = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: red;
  width: 120px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ffffff, 0 0 40px #ffffff, 0 0 50px #ffffff,
      0 0 60px #ffffff, 0 0 70px #ffffff;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`

// eslint-disable-next-line react/prop-types
const NFTCard = ({ tokenId, isStaked, balance, src, tier, level }) => {
  const [nftStakingContract, setNftStakingContract] = useState(null)
  // const [nftContract, setNftContract] = useState(null)
  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    let tempSigner = tempProvider.getSigner()
    // // Get NFT contract
    // let nftContract = new ethers.Contract(config.NFTAddress, abi, tempSigner)
    // setNftContract(nftContract)
    //Get New NFT staking contract
    let nftStakingContract = new ethers.Contract(
      config.NFTStakingAddress,
      nftStakingABI,
      tempSigner,
    )
    setNftStakingContract(nftStakingContract)
    //Get New sDOOD Token contract
    // let sDoodContract = new ethers.Contract(config.sDoodAddress, sdood, tempSigner)
    // setNftStakingContract(sDoodContract)
    // console.log(nftStakingContract);
  }

  const stake = async () => {
    let tokenIdArray = [tokenId]
    await nftStakingContract.stake(tokenIdArray, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then((tx) => {
        window.location.reload()
        localStorage.clear()
      })
    })
  }

  const unstake = async () => {
    let tokenIdArray = [tokenId]
    await nftStakingContract.unStake(tokenIdArray, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(async (tx) => {
        window.location.reload()
      })
    })
  }

  const upgrade = async () => {
    await nftStakingContract.UpgradeLevel(tokenId, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(() => {
        window.location.reload()
      })
    })
  }

  const upgradeMax = async () => {
    await nftStakingContract.UpgradeLevelMax(tokenId, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(() => {
        window.location.reload()
      })
    })
  }

  useEffect(() => {
    updateEthers()
  }, [])

  if (isStaked) {
    return (
      <CardContainer className="nftCardContainer">
        <Image src={src} />
        <h1
          style={{
            fontWeight: '800',
            fontSize: '20px',
            color: 'rgb(69, 42, 122)',
          }}
        >
          #{tokenId}
        </h1>
        <h1
          style={{
            fontWeight: '800',
            fontSize: '20px',
            color: 'rgb(69, 42, 122)',
          }}
        >
          lvl {level}
        </h1>
        <h1
          style={{
            fontWeight: '800',
            fontSize: '20px',
            color: 'rgb(69, 42, 122)',
          }}
        >
          {balance} {config.symbol}
        </h1>
        <Button
          onClick={unstake}
          style={{
            background: 'rgb(118, 69, 217)',
            fontSize: '14px',
            color: 'white',
          }}
        >
          Unstake
        </Button>
        {/* <Button onClick={harvest}>
          Claim {balance} {config.symbol}
    </Button> */}
        <Button
          onClick={upgrade}
          style={{
            background: 'rgb(118, 69, 217)',
            fontSize: '14px',
            color: 'white',
          }}
        >
          Upgrade
        </Button>
        <Button
          onClick={upgradeMax}
          style={{
            background: 'rgb(118, 69, 217)',
            fontSize: '14px',
            color: 'white',
          }}
        >
          Upgrade Max
        </Button>
      </CardContainer>
    )
  } else {
    return (
      <CardContainer>
        <Image src={src} />
        <h1
          style={{
            fontWeight: '800',
            fontSize: '20px',
            color: 'rgb(69, 42, 122)',
          }}
        >
          #{tokenId}
        </h1>
        <Button
          className="stakeBtn"
          onClick={stake}
          style={{
            background: 'rgb(118, 69, 217)',
            fontSize: '14px',
            color: 'white',
          }}
        >
          Stake
        </Button>
      </CardContainer>
    )
  }
}

export default NFTCard

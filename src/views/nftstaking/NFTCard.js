import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// import abi2 from "../assets/abi/abi2.json";
import abi from '../../assets/abi/abi.json'
import sdood from '../../assets/abi/sdood.json'

import config from '../../config/config'
import nftStakingABI from '../../assets/abi/nftStakingABI.json'

const ethers = require('ethers')

const CardContainer = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid black;
  border-radius: 20px;
  padding: 20px;
  gap: 5px;
  background: white;
`

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  border: 3px solid black;
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
const NFTCard = ({ tokenId, staked, balance, src, tier, level }) => {
  // useState provider null
  const [provider, setProvider] = useState(null)
  // useState contract null
  const [nftContract, setNftContract] = useState(null)
  // useState nftStaking Contrac null
  const [nftStakingContract, setNftStakingContract] = useState(null)
  // useState signer null
  const [signer, setSigner] = useState(null)

  // usestate currentTier 0
  const [currentTier, setCurrentTier] = useState(0)

  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    let tempSigner = tempProvider.getSigner()
    //Old NftStaking
    // let tempContract = new ethers.Contract(config.SCTAddress, abi2, tempSigner);
    // setProvider(tempProvider);
    // setSigner(tempSigner);
    // setContract(tempContract);

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
    setNftStakingContract(nftStakingContract)
    // console.log(nftStakingContract);
  }

  const stake = async () => {
    //await nftContract.approve(config.NFTStakingAddress, tokenId, { gasLimit: 3000000 });
    // await nftContract.approve(config.NFTStakingAddress, tokenId, { gasLimit: 3000000 }).then((tx) => {
    //   tx.wait().then((tx) => {
    //     window.location.reload();
    //   });
    // });
    let tokenIdArray = [tokenId]
    //await nftStakingContract.stake(tokenIdArray, { gasLimit: 3000000 }
    //   );
    await nftStakingContract.stake(tokenIdArray, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then((tx) => {
        window.location.reload()
      })
    })
  }

  const unstake = async () => {
    await nftStakingContract.withdraw([tokenId], { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(async (tx) => {
        await nftStakingContract.claimRewards().then((tx) => {
          tx.wait().then((tx) => {
            window.location.reload()
          })
        })
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
    await nftStakingContract.UpgradeMax(tokenId, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then(() => {
        window.location.reload()
      })
    })
  }

  useEffect(() => {
    updateEthers()
  }, [])

  if (staked) {
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

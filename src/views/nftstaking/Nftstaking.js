import React, { useState } from 'react'
import config, { NFTAddress, NFTStakingAddress } from '../../config/config'
import abi from '../../assets/abi/abi.json'
import styled from 'styled-components'
import nftstakingabi from '../../assets/abi/nftStakingABI.json'
import sDooDABI from '../../assets/abi/sdood.json'
import { CCol, CRow } from '@coreui/react'
import '../../scss/custom.scss'
import WelcomeIMG from '../../assets/images/welcome.png'
import NFTCard from './NFTCard'
const ethers = require('ethers')

const StakingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`

const Title = styled.h1`
  text-align: center;
`

const Image = styled.div`
  background-image: url(${WelcomeIMG});
  background-size: contain;
  background-repeat: no-repeat;
  width: 500px;
  height: 400px;
`

const StakingWrapper = styled.div`
  margin: 20px;
  gap: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const InfoPanel = styled.div`
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 750px;
  min-height: 600px;
  border-radius: 20px;
  border: 5px solid black;
  padding: 20px;
  background: white;
`

const Button = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: red;
  width: 200px;
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

const Splitter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const TokenContainer = styled.div`
  width: 87%;
  margin: 0px 50px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  border: 5px solid black;
  padding: 20px;
  border-radius: 20px;
`

const TokenGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  gap: 20px;
  color: red;
`

const Nftstaking = () => {
  // usestate isConnected false
  const [isConnected, setIsConnected] = useState(false)
  // usestate isStartStaking false
  const [isStartStaking, setIsStartStaking] = useState(false)
  // usestate defaultAccount null
  const [defaultAccount, setDefaultAccount] = useState(null)
  // usestate totalStaked 0
  const [totalStaked, setTotalStaked] = useState(0)
  // usestate isUserStaked false
  const [isUserStaked, setIsUserStaked] = useState(false)
  // usestate loading false
  const [loading, setLoading] = useState(false)
  // startedStaking false
  const [startedStaking, setStartedStaking] = useState(false)
  // usestate totalRewards 0
  const [totalRewards, setTotalRewards] = useState(0)
  // usestate sctBalance 0
  const [sctBalance, setSctBalance] = useState(0)

  // usestate has stakedNFTs false
  const [hasStakedNFTs, setHasStakedNFTs] = useState(false)
  // usestate has unstakedNFTs false
  const [hasUnstakedNFTs, setHasUnstakedNFTs] = useState(false)

  // usestate stakedNFTs []
  const [stakedNFTs, setStakedNFTs] = useState([])
  // usestate unstakedNFTs []
  const [unstakedNFTs, setUnstakedNFTs] = useState([])

  // usestate provider null
  const [provider, setProvider] = useState(null)
  // usestate contract null
  const [contract, setContract] = useState(null)
  // usestate signer null
  const [signer, setSigner] = useState(null)

  // usestate provider null
  const [provider2, setProvider2] = useState(null)
  // usestate contract null
  const [contract2, setContract2] = useState(null)
  // usestate nftstakingcontract null
  const [nftstakingcontract, setNftStakingContract] = useState(null)
  // usestate signer null
  const [signer2, setSigner2] = useState(null)

  const selectedAccount = window.ethereum.selectedAddress

  const connect = async () => {
    if (window.ethereum !== undefined) {
      let chain = config.chainId.toString()
      if (window.ethereum.networkVersion === chain) {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((account) => {
          setIsConnected(true)
          accountChangedHandler(account[0])
        })
      }
    } else {
      setIsConnected(false)
    }
  }

  const accountChangedHandler = (account) => {
    setDefaultAccount(account)
    updateEthers()
  }

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)
    let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum)
    setProvider2(tempProvider2)

    let tempSigner = tempProvider.getSigner()
    setSigner(tempSigner)
    let tempSigner2 = tempProvider2.getSigner()
    setSigner2(tempSigner2)

    let tempContract = new ethers.Contract(config.NFTAddress, abi, tempSigner)
    setContract(tempContract)
    let tempContract2 = new ethers.Contract(config.sDoodAddress, sDooDABI, tempSigner2)
    setContract2(tempContract2)
    let nftStakingcontract = new ethers.Contract(
      config.NFTStakingAddress,
      nftstakingabi,
      tempSigner,
    )
    setNftStakingContract(nftStakingcontract)
  }

  const startStaking = async () => {
    let stakedTokens = []
    let unstakedTokens = []
    let level = []
    setLoading(true)
    // let total =  nftstakingcontract.availableRewards(NFTAddress);
    // setTotalRewards(total);
    //   await contract.walletOfOwner(NFTStakingAddress).then( async (wallet) => {
    //       await nftstakingcontract.availableRewards(NFTAddress).then((total) =>{
    //         console.log(total)
    //         // setTotalRewards(total);
    //       //  console.log('level', level);
    //   });
    // })
    await contract.walletOfOwner(defaultAccount).then(async (wallet) => {
      for (let j = 0; j < wallet.length; j++) {
        await nftstakingcontract.stakeNFT(Number(wallet[j].toString())).then((stakeInfo) => {
          level = stakeInfo.level
          //  console.log('level', level);
          stakedTokens.push({
            tokenId: Number(wallet[j]).toString(),
            level: Number(level).toString(),
            src: config.baseURI + '/' + wallet[j].toString() + '.png',
            staked: true,
          })
        })
      }
    })

    await contract2.balanceOf(defaultAccount).then((balance) => {
      let unrounded = ethers.utils.formatEther(balance.toString())
      let balance2 = parseFloat(unrounded).toFixed(2)
      setSctBalance(balance2)
    })

    await contract.walletOfOwner(defaultAccount).then(async (wallet) => {
      for (let i = 0; i < wallet.length; i++) {
        await nftstakingcontract.stakeNFT(Number(wallet[i].toString())).then((stakeInfo) => {
          if (!stakeInfo.flag) {
            unstakedTokens.push({
              tokenId: Number(wallet[i].toString()),
              balance: 0,
              src: config.baseURI + '/' + wallet[i].toString() + '.png',
            })
          }
        })
      }
    })

    unstakedTokens.sort((a, b) => {
      return a.tokenId - b.tokenId
    })
    stakedTokens.sort((a, b) => {
      return a.tokenId - b.tokenId
    })

    setStakedNFTs(stakedTokens)
    console.log('stakedTokens', stakedTokens)
    console.log('unstaked', unstakedTokens)
    setUnstakedNFTs(unstakedTokens)
    setLoading(false)
    setIsStartStaking(true)
    setStartedStaking(true)
  }

  const harvest = async () => {
    nftstakingcontract.claimRewards().then((tx) => {
      tx.wait().then(() => {
        window.location.reload()
      })
    })
  }

  const stakeAll = async () => {
    let token_id = []
    for (let i = 0; i < unstakedNFTs.length; i++) {
      token_id[i] = unstakedNFTs[i].tokenId
    }
    console.log(token_id)
    await nftstakingcontract.stake(token_id, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then((tx) => {
        window.location.reload()
      })
    })
  }

  const unstakeAll = async () => {
    // await Promise.all(stakedNFTs.map(async nft =>{

    //   await nftstakingcontract.withdraw([nft.tokenId], { gasLimit: 3000000 });
    //   await nftstakingcontract.claimRewards();
    //   window.location.reload();
    let token_id = []
    for (let i = 0; i < stakedNFTs.length; i++) {
      token_id[i] = stakedNFTs[i].tokenId
    }
    await nftstakingcontract.withdraw(token_id, { gasLimit: 3000000 }).then((tx) => {
      tx.wait().then((tx) => {
        nftstakingcontract.claimRewards()
        window.location.reload()
      })
    })
  }

  const approve = async () => {
    await contract.setApprovalForAll(contract2.address, true).then((tx) => {
      tx.wait().then(() => {
        console.log('Approved')
      })
    })
  }

  return (
    <StakingContainer style={{ paddingTop: '100px' }}>
      <Title
        style={{
          fontWeight: '800',
          fontSize: '50px',
          color: 'rgb(69, 42, 122)',
        }}
      >
        Welcome to Staking Portal
      </Title>

      <h1
        className="top-title"
        style={{
          fontWeight: '600',
          fontSize: '22px',
          color: 'rgb(69, 42, 122)',
        }}
      >
        <center>
          - Lvl 0 - Earn 150 per day
          <br />
          - Lvl 1 costs 900 $sDOOD = Lvl 1 - Earn 200 sDOOD/day
          <br />
          - Lvl 2 costs 1350 $sDOOD = Lvl 2 - Earn 250 sDOOD/day
          <br />
          - Lvl 3 costs 1800 $sDOOD = Lvl 3 - Earn 350 sDOOD/day
          <br />
          - Lvl 4 costs 2250 $sDOOD = Lvl 4 - Earn 400 sDOOD/day
          <br />
        </center>{' '}
      </h1>

      <StakingWrapper>
        <div
          className="nftstaking-top-img"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
            height: '400px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={WelcomeIMG}
            alt="banner"
            style={{
              width: '100%',
              borderRadius: '20px',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
            height: '316px',
            alignItems: 'center',
            borderRadius: '50px',
            background: 'white',
            padding: '20px',
          }}
        >
          {!isConnected ? (
            <>
              <h1
                style={{
                  fontWeight: '800',
                  fontSize: '20px',
                  color: 'rgb(69, 42, 122)',
                  paddingTop: '20%',
                }}
              >
                Connect Your Wallet
              </h1>{' '}
              <br />
              <Button
                onClick={connect}
                style={{
                  background: 'rgb(118, 69, 217)',
                  fontSize: '20px',
                  color: 'white',
                }}
              >
                Connect
              </Button>
            </>
          ) : (
            <>
              {loading ? (
                <h1
                  style={{
                    fontWeight: '800',
                    fontSize: '20px',
                    color: 'rgb(69, 42, 122)',
                    paddingTop: '20%',
                  }}
                >
                  {' '}
                  Gathering info - loading{' '}
                </h1>
              ) : (
                <>
                  {startedStaking ? (
                    <>
                      <Splitter>
                        <h1
                          style={{
                            fontWeight: '800',
                            fontSize: '20px',
                            color: 'rgb(69, 42, 122)',
                          }}
                        >
                          {stakedNFTs.length / 10000}% Staked
                        </h1>
                        <br />
                        <br />
                        <h1
                          style={{
                            fontWeight: '800',
                            fontSize: '20px',
                            color: 'rgb(69, 42, 122)',
                          }}
                        >
                          {stakedNFTs.length} / 10000
                        </h1>
                      </Splitter>
                      <Splitter>
                        <h1
                          style={{
                            fontWeight: '800',
                            fontSize: '22px',
                            color: 'rgb(69, 42, 122)',
                          }}
                        >
                          My sDOOD Balance :
                        </h1>
                        <h1
                          style={{
                            fontWeight: '800',
                            fontSize: '18px',
                            color: 'rgb(69, 42, 122)',
                          }}
                        >
                          {sctBalance}
                        </h1>
                      </Splitter>
                      <br />
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '20px',
                          color: 'rgb(69, 42, 122)',
                        }}
                      >
                        Connected to :{' '}
                        <span
                          style={{
                            fontWeight: '500',
                            fontSize: '15px',
                            color: 'rgb(69, 42, 122)',
                          }}
                        >
                          {' '}
                          {defaultAccount.slice(0, 6) + '...' + defaultAccount.slice(-4)}
                        </span>
                      </p>{' '}
                      <br />
                      <h1
                        style={{
                          fontWeight: '800',
                          fontSize: '24px',
                          color: 'rgb(69, 52, 152)',
                          textAlign: 'center',
                        }}
                      >
                        You have staked {stakedNFTs.length} DoodCats and <br />
                        {unstakedNFTs.length} DoodCats available to stake.
                      </h1>
                    </>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '20px',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '20px',
                          color: 'rgb(69, 42, 122)',
                          textAlign: 'center',
                        }}
                      >
                        You need to approve first in order to stake your DoodCats.
                      </p>
                      <Button
                        onClick={approve}
                        style={{
                          background: 'rgb(118, 69, 217)',
                          fontSize: '20px',
                          color: 'white',
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={startStaking}
                        style={{
                          background: 'rgb(118, 69, 217)',
                          fontSize: '20px',
                          color: 'white',
                        }}
                      >
                        Start Staking
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </StakingWrapper>
      {isStartStaking ? (
        <StakingWrapper>
          {stakedNFTs.length === 0 ? (
            ''
          ) : (
            <InfoPanel>
              <h1
                style={{
                  fontWeight: '800',
                  fontSize: '32px',
                  color: 'rgb(69, 52, 152)',
                  textAlign: 'center',
                }}
              >
                Staked NFTs
              </h1>
              <Splitter>
                <Button
                  onClick={harvest}
                  style={{
                    background: 'rgb(118, 69, 217)',
                    fontSize: '20px',
                    color: 'white',
                  }}
                >
                  Harvest All
                </Button>
                <h1
                  style={{
                    fontSize: '32px',
                    color: 'Black',
                  }}
                >
                  Total : {totalRewards}{' '}
                </h1>
                <Button
                  onClick={unstakeAll}
                  style={{
                    background: 'rgb(118, 69, 217)',
                    fontSize: '20px',
                    color: 'white',
                  }}
                >
                  Unstake All
                </Button>
              </Splitter>
              <TokenGrid>
                {stakedNFTs.map((token) => {
                  return (
                    <>
                      <NFTCard
                        tokenId={token.tokenId}
                        staked={token.staked}
                        // balance={token.balance}
                        src={token.src}
                        level={token.level}
                      />
                    </>
                  )
                })}
              </TokenGrid>
              <Splitter>
                <Button
                  onClick={harvest}
                  style={{
                    background: 'rgb(118, 69, 217)',
                    fontSize: '20px',
                    color: 'white',
                  }}
                >
                  Harvest All
                </Button>
                <h1
                  style={{
                    fontSize: '32px',
                    color: 'Black',
                  }}
                >
                  Total : {totalRewards}{' '}
                </h1>
                <Button
                  onClick={unstakeAll}
                  style={{
                    background: 'rgb(118, 69, 217)',
                    fontSize: '20px',
                    color: 'white',
                  }}
                >
                  Unstake All
                </Button>
              </Splitter>
            </InfoPanel>
          )}
          {unstakedNFTs.length === 0 ? (
            ''
          ) : (
            <InfoPanel>
              <h1
                style={{
                  fontWeight: '800',
                  fontSize: '32px',
                  color: 'rgb(69, 52, 152)',
                  textAlign: 'center',
                }}
              >
                Unstaked NFTs
              </h1>

              <TokenGrid>
                {unstakedNFTs.map((token) => {
                  return (
                    <>
                      <NFTCard
                        tokenId={token.tokenId}
                        //  staked={token.staked}
                        //  balance={token.balanc2}
                        src={token.src}
                      />
                    </>
                  )
                })}
              </TokenGrid>
              <Splitter
                style={{
                  justifyContent: 'center',
                }}
              >
                <Button
                  onClick={stakeAll}
                  style={{
                    background: 'rgb(118, 69, 217)',
                    fontSize: '20px',
                    color: 'white',
                  }}
                >
                  Stake All
                </Button>
              </Splitter>
            </InfoPanel>
          )}
        </StakingWrapper>
      ) : (
        ''
      )}
    </StakingContainer>
  )
}
export default Nftstaking

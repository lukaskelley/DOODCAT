import React, { useState } from 'react'
import styled from 'styled-components'
import banner from '../../assets/images/welcome.png'
import config, { NFTStakingAddress } from '../../config/config'
import abi from '../../assets/abi/abi.json'
import nftstakingabi from '../../assets/abi/nftStakingABI.json'
import sDooDABI from '../../assets/abi/sdood.json'
import NFTCard from './NFTCard'
import '../../scss/custom.scss'
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
  align-items: center;
  width: 100%;
  min-height: 600px;
  border-radius: 20px;
  box-shadow: rgb(25 19 38 / 70%) 0px 8px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  padding: 10px;
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
  // usestate loading false
  const [loading, setLoading] = useState(false)
  // startedStaking false
  const [startedStaking, setStartedStaking] = useState(false)
  // usestate totalRewards 0
  const [totalRewards, setTotalRewards] = useState(0)
  // usestate sctBalance 0
  const [sctBalance, setSctBalance] = useState(0)
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
    localStorage.setItem('defaultaccount', account)
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

    await nftstakingcontract.getStakedNFTList(defaultAccount).then(async (wallet) => {
      localStorage.setItem('MystakedNFT', wallet.length)
      for (let j = 0; j < wallet.length; j++) {
        // eslint-disable-next-line no-loop-func
        await nftstakingcontract.stakedNFTs(Number(wallet[j].toString())).then((stakeInfo) => {
          nftstakingcontract.calculateRewardsNFT(Number(wallet[j])).then((totalreward) => {
            let unrounded = ethers.utils.formatEther(totalreward.toString())
            let total = parseFloat(unrounded).toFixed(2)
            stakedTokens.push({
              tokenId: Number(wallet[j]).toString(),
              balance: total,
              level: Number(stakeInfo.level).toString(),
              src: config.baseURI + '/' + wallet[j].toString() + '.png',
              isStaked: true,
            })
          })
        })
      }
    })
    await contract2.balanceOf(defaultAccount).then((balance) => {
      let unrounded = ethers.utils.formatEther(balance.toString())
      let balance2 = parseFloat(unrounded).toFixed(2)
      setSctBalance(balance2)
      localStorage.setItem('sdoodBalance', balance2)
    })
    await nftstakingcontract.getTotalBurn().then((totalBurn) => {
      let unrounded = ethers.utils.formatEther(totalBurn.toString())
      let burn = parseFloat(unrounded).toFixed(2)
      localStorage.setItem('sdoodBurn', burn)
    })
    await nftstakingcontract.getTotalrewards(defaultAccount).then((balance) => {
      let unrounded = ethers.utils.formatEther(balance.toString())
      let balance2 = parseFloat(unrounded).toFixed(2)
      setTotalRewards(balance2)
      console.log('totalreward==>', totalRewards)
    })
    await contract.walletOfOwner(defaultAccount).then(async (wallet) => {
      for (let i = 0; i < wallet.length; i++) {
        await nftstakingcontract.stakedNFTs(Number(wallet[i].toString())).then((stakeInfo) => {
          if (!stakeInfo.isStaked) {
            unstakedTokens.push({
              tokenId: Number(wallet[i].toString()),
              isStaked: false,
              src: config.baseURI + '/' + wallet[i].toString() + '.png',
            })
          }
        })
      }
    })

    await contract.walletOfOwner(NFTStakingAddress).then((nftTotalStaked) => {
      localStorage.setItem('TotalstakedNFT', nftTotalStaked.length)
    })

    unstakedTokens.sort((a, b) => {
      return a.tokenId - b.tokenId
    })
    stakedTokens.sort((a, b) => {
      return a.tokenId - b.tokenId
    })
    setStakedNFTs(stakedTokens)
    console.log(stakedNFTs)
    setUnstakedNFTs(unstakedTokens)
    setLoading(false)
    setIsStartStaking(true)
    setStartedStaking(true)
  }
  const harvest = async () => {
    let token_id = []
    for (let i = 0; i < stakedNFTs.length; i++) {
      token_id[i] = stakedNFTs[i].tokenId
    }
    nftstakingcontract.claimRewards(token_id).then((tx) => {
      tx.wait().then(() => {
        window.location.reload()
      })
    })
  }
  const setApprovalAll = async () => {
    let approve_nft = localStorage.getItem('approve_nft')
    if (!approve_nft)
      await contract.setApprovalForAll(NFTStakingAddress, true).then((tx) => {
        tx.wait().then((tx) => {
          localStorage.setItem('approve_token', true)
          console.log('approved')
        })
      })
  }

  const stakeAll = async () => {
    let token_id = []
    for (let i = 0; i < unstakedNFTs.length; i++) {
      token_id[i] = unstakedNFTs[i].tokenId
    }
    console.log(token_id)
    await nftstakingcontract.stake(token_id).then((tx) => {
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
    await nftstakingcontract.unStake(token_id).then((tx) => {
      tx.wait().then((tx) => {
        nftstakingcontract.claimRewards()
        window.location.reload()
      })
    })
  }

  // const approve = async () => {
  //   await contract.setApprovalForAll(contract2.address, true).then((tx) => {
  //     tx.wait().then(() => {
  //       console.log('Approved')
  //     })
  //   })
  // }

  return (
    <StakingContainer className="nftStakingContainer" style={{ padding: '50px' }}>
      <Title
        className="nftStakingTopTitle"
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
          fontSize: '20px',
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
          - Lvl 3 costs 1800 $sDOOD = Lvl 3 - Earn 300 sDOOD/day
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
            width: '400px',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={banner}
            alt="banner"
            style={{
              width: '100%',
              borderRadius: '20px',
            }}
          />
        </div>
        <div
          className="connectWalletContainer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
            height: '100%',
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
                  textAlign: 'center',
                  fontWeight: '800',
                  fontSize: '20px',
                  color: 'rgb(69, 42, 122)',
                  paddingTop: '10%',
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
                    paddingTop: '1%',
                  }}
                >
                  {' '}
                  Hold on Dood! We are working{' '}
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
                            fontWeight: '700',
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
                            fontWeight: '700',
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
                        onClick={setApprovalAll}
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
                  className="harvestBtn"
                  onClick={harvest}
                  style={{
                    background: 'rgb(118, 69, 217)',
                    fontSize: '18px',
                    color: 'white',
                  }}
                >
                  Harvest All
                </Button>
                <h1
                  className="totalValue"
                  style={{
                    fontSize: '24px',
                    color: 'rgb(69, 42, 122)',
                    fontWeight: '700',
                  }}
                >
                  Total : {totalRewards}{' '}
                </h1>
                <Button
                  className="unstakeAllBtn"
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
              <TokenGrid className="unstakedContainer">
                {stakedNFTs.map((token) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <NFTCard
                      tokenId={token.tokenId}
                      isStaked={token.isStaked}
                      balance={token.balance}
                      src={token.src}
                      level={token.level}
                    />
                  )
                })}
              </TokenGrid>
              <Splitter>
                <Button
                  className="harvestBtn"
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
                  className="totalValue"
                  style={{
                    fontSize: '30px',
                    color: 'rgb(69, 42, 122)',
                    fontWeight: '700',
                  }}
                >
                  Total : {totalRewards}{' '}
                </h1>
                <Button
                  className="unstakeAllBtn"
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

              <TokenGrid className="unstakedContainer">
                {unstakedNFTs.map((token) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <NFTCard
                      tokenId={token.tokenId}
                      //  staked={token.staked}
                      //  balance={token.balanc2}
                      src={token.src}
                    />
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

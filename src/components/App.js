import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import './App.css'

class App extends Component {

async componentDidMount() {
  await this.loadWeb3()
  await this.loadBlockChainData()
}
async loadBlockChainData(){
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  this.setState({account: accounts[0]})

  const   ethBalance = await web3.eth.getBalance(this.state.account)
  this.setState({ethBalance})

  //Load Token
  const networkId = await web3.eth.net.getId()
  const tokenData = Token.networks[networkId]
  if(tokenData){
    const token = new web3.eth.Contract(Token.abi, tokenData.address)
    this.setState({token})
    let tokenBalance = await token.methods.balanceOf(this.state.account).call()
    console.log("tokenBalance", tokenBalance.toString())
    this.setState({tokenBalance: tokenBalance.toString()})
  } else {
    window.alert('Token contract not deployed to detected network.')
  }
  
}

async loadWeb3(){
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

constructor(props){
  super(props)
  this.state = {
    accounts: '',
    token: {},
    ethBalance: '0',
    tokenBalance: '0'
  }
}

  render() {
    return (
      <div>
        <Navbar account = {this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="App-title">Hello World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

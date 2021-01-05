import 'regenerator-runtime/runtime'
import React, { useEffect,setState, useState } from 'react'
import { login, logout } from './utils'
import './global.css'
import './scss/AppStyles.scss'
import { Navbar, NavDropdown, Nav, Container, Row, Col } from 'react-bootstrap'
import MatchView from './Components/MatchView'
import TwitchViewHome from './Components/TwitchViewHome'
import CreateMatch from './Components/CreateMatch'
import NewChallenge from './Components/NewChallenge'
import EnterInfo from './Components/EnterInfo'
import MyChallenges from './Components/MyChallenges'
import TokenManager from './Components/TokenManager'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



import getConfig from './config'
import PlayerView from './Components/PlayerView'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')


export default function App() {
 let escrowAccountName='overblock.blockheads.testnet'


  console.log('https://ovrstat.com/stats/pc/Viz-1213')

  


  const titleStyle = {
    color: 'rgb(237, 172, 87)'
  }


  const [containsBattleTag,changeContainsBattleTag]=useState('loading')
  const [watchTokenAmount,changeWatchTokenAmount]=useState(0)


  


  useEffect(
    () => {
      const getData = async () => {

        const data = await fetch("https://ovrstat.com/stats/pc/Viz-1213")
          .then(res => res.json())
          .then(res => console.log(res))

      }
      getData()
    }
    , []
  )

  useEffect(
    ()=>{
      const checkBlockChain=async()=>{
        
        let battleTagStatus=await window.contract.CheckTags({name:window.accountId})

        if(battleTagStatus){
          changeContainsBattleTag('showApp')
        }
        else{
          changeContainsBattleTag('enterInfo')
        }

      }
      checkBlockChain();

    },[]
  )

  useEffect(
    ()=>{
      const getWatchTokens=async()=>{
     let tokenVal=await window.contract.retreiveTokenAmount({user:window.accountId})
     changeWatchTokenAmount(tokenVal)
    }
    getWatchTokens()
    },[]
  )


  

  return (

    <Router>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Block<span style={titleStyle}>WATCH</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>

            <Nav.Item style={{display:'flex',alignItems:'center',marginRight:'10px'}}><Link to='/newChallenge'>Create New Challenge</Link>
            </Nav.Item>            
            <Nav.Item style={{display:'flex',alignItems:'center',marginRight:'10px'}}><Link to='/challengeinventory'>Challenge Manager</Link>
            </Nav.Item>

            <Nav.Item style={{color:'orange',display:'flex',alignItems:'center',marginRight:'10px'}}><Link to='/tokenmanager'>Watch Token Amount: {watchTokenAmount}</Link></Nav.Item>
            <Nav.Link onClick={(window.accountId === '') ? login : logout}>
              {(window.accountId === '') ? 'login' : window.accountId}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      

      {
      (containsBattleTag==='loading')?<p style={{color:'white'}}>Loading</p>:
      (containsBattleTag==='enterInfo')?<EnterInfo/>:(
      <Switch>
        <Route exact path="/">
          <Container>
            <Col>
              <TwitchViewHome/>
            </Col>
            <Col>
              <MatchView />
            </Col>


          </Container>
        </Route>

        <Route exact path="/creatematch">
          <CreateMatch/>
        </Route>
        <Route exact path="/newChallenge">
          <NewChallenge/>
        </Route>
        <Route exact path='/challengeinventory'>
          <MyChallenges escrow={escrowAccountName}/>
        </Route>
        <Route exact path='/tokenmanager'>
          <TokenManager></TokenManager>
        </Route>

      </Switch>)
}



    </Router>

  )

}



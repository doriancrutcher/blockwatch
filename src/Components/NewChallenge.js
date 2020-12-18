import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Form, FormControl, InputGroup, Container, Row } from 'react-bootstrap'
import date from 'date-and-time'
import { async } from 'regenerator-runtime';

const NewChallenge = props => {

  const inputBattleTag = useRef(null);
  const inputTwitch = useRef(null);
  const overwatchHeroes = ['Ana', 'Ashe', 'Baptiste', 'Bastion', 'Brigitte', 'D.Va', 'Doomfist', 'Echo', 'Genji', 'Hanzo', 'Junkrat', 'Lucio', 'Mcree', 'Mei', 'Mercy', 'Moira', 'Orisa', 'Pharah', 'Reaper', 'Reinhardt', 'Roadhog', 'Sigma', 'Soilder76', 'Sombra', 'Symmetra', 'Torbjorn', 'Tracer', 'WindowMaker', 'Winston', 'WreckingBall', 'Zarya', 'Zentatta']


  const [publicOrPrivate, changeToPublicOrPrivate] = useState('Private')
  const [individualOrTeams, changeIndividualOrTeams] = useState('individual')
  const [heroSpecific, changeHeroSpecific] = useState('Any Hero')
  const [today, changeToday] = useState(true)
  const [dateValue, changeDateValue] = useState('')
  const [gameSetting, changeGameSetting] = useState('Kill')
  const [challengeTitle, changeChallengeTitle] = useState('')
  const [submitStatus,changeSubmitStatus]=useState(false)


  const currentHour = new Date().getHours()
  const dateObject = new Date()
  const currentDate = `${(dateObject.getMonth() + 1 < 10) ? "0" + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1}/${(dateObject.getDate() < 10) ? "0" + dateObject.getDate() : dateObject.getDate()}/${dateObject.getFullYear()}`
  const availiableHours = []
  const allHours = []

  // ------------------------ DOM References -------------------------------// 
  const challengeRef = useRef(null)
  const dateRef = useRef(null)
  const heroRef = useRef(null)
  const pointRef = useRef(null)
  const entranceFeeRef = useRef(null)
  const challengeTitleRef = useRef(null)
  const participantRef = useRef(null)




  console.log(currentDate)

  for (let i = currentHour; i < 24; i++) {
    if (i > 12) {
      let x = i - 12
      availiableHours.push(`${x}:00PM`)
    } else {
      availiableHours.push(`${i}:00AM`)
    }
  }

  for (let i = 0; i < 24; i++) {
    if (i > 12) {
      let x = i - 12
      allHours.push(`${x}:00PM`)
    } else {
      allHours.push(`${i}:00AM`)
    }
  }

  console.log(availiableHours)



  // Function collection needed to send info to blockchain 

  // Function 1 challenge array creation and addition 
  // Here this function will collect and consolodate all the separate pieces of information from the form that was created 

  const createUniqueTitleName = async () => {
    let currentTitle = challengeTitleRef.current.value
    let currentChallengeListLength = await window.contract.getChallengeLength()
    console.log(currentTitle + currentChallengeListLength)
    await contract.addToChallengeIds({ title: currentTitle + currentChallengeListLength })
   console.log(`new title is ${currentTitle} and ${currentChallengeListLength}`)
    return currentTitle + '  [challenge ID#:' +currentChallengeListLength +']'
  }

  const createAndPushChallengeArray = async (titleName) => {
    // collection area
   
    let challengeType = challengeRef.current.value
    let challengeEndCondition = pointRef.current.value
    let challengeEntranceFee = entranceFeeRef.current.value

    console.log(`Title ${titleName} type:${challengeType} end condition:${challengeEndCondition} the Entrance Fee:${challengeEntranceFee} `)
    await window.contract.addToChallengeMap({ title: String(titleName), type: challengeType, endCondition: challengeEndCondition, entranceFee: challengeEntranceFee, challengeStatus: 'active' })
   

  }



  const sendToBlockChain = async () => {
    // Disabling button 
    changeSubmitStatus(true)

    // Retreiving and storying name data 
    let getParticipants = participantRef.current.value
    let makeParticipantArray = getParticipants.split(',')
    let removeSpaces = [];
    let Title=await createUniqueTitleName()

    // Document Fill check 

    if (challengeTitleRef.current.value === '') {  changeSubmitStatus(false);return alert('Enter a Title you Jerk') }
    if (entranceFeeRef.current.value === '' || entranceFeeRef.current.value.match(/[a-zA-Z]/g) !== null) {  changeSubmitStatus(false);return alert('Is anything ever truly free? Please enter some sort of entrance fee for this challenge') }
    if (pointRef.current.value === '' || pointRef.current.value.match(/[a-zA-Z]/g) !== null) {  changeSubmitStatus(false);return alert('Sometimes things must end. Please enter the end condition') }

    if (getParticipants !== '') {
      makeParticipantArray.forEach(x => {
        removeSpaces.push(x.match(/\S/g).join(''))
      })

      for (const x of removeSpaces) {
        if (x.match(/\.testnet/g) === null || x.match(/\.testnet/g)[0] !== '.testnet') {
          console.log('invalid username')
          return (alert('invalid participant username detected'))
        }
      }
    } else {
      return alert('I mean you must know someone to play with you')
    }

    await window.contract.addToOwnerMap({title:Title})
    await createAndPushChallengeArray(Title);
    await window.contract.addToPrivateParty({title:Title,participants:removeSpaces})
    
    removeSpaces.forEach(async(x)=>{
    await  window.contract.addToChallengerMap({challenger: x, title: Title}).then(
     
    )
    }
    )
    console.log('challenge created!')

  }












  https://ow-api.com/v1/stats/pc/us/dorgon108-1679/profile


  return (
<Container>
  <Row style={{color:'white',marginTop:'10px'}}  className='d-flex justify-content-center'><h1>Create Your Challenge</h1></Row>
  <Row style={{marginTop:'10px'}} className='d-flex justify-content-center'>
    <Form style={{ boarderRadius:'10px', width:'80vw',padding:'10px',backgroundColor: 'rgb(50,50,50)', color: 'white' }}>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Challenge Title</Form.Label>
        <Form.Control ref={challengeTitleRef} placeholder="Enter Challenge Title Here..." />
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Public Or Private?</Form.Label>
        <Form.Control onChange={() => { (publicOrPrivate === 'Public') ? changeToPublicOrPrivate('Private') : changeToPublicOrPrivate('Public') }} as="select">
          <option>Private</option>
          <option>Public</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Challenge Type</Form.Label>
        <Form.Control ref={challengeRef} onChange={() => changeGameSetting(challengeRef.current.value)} as="select">
          <option>Solo Kills</option>
          <option>Victories</option>
          <option>Medals</option>
        </Form.Control>
      </Form.Group>


      {(gameSetting === "Kill") ?
        <Form.Group>
          <Form.Label>Kills to Win</Form.Label>
          <Form.Control
            onChange={() => {
              changeDateValue(pointRef.current.value)
            }}
            ref={pointRef}
            type="text"
            placeholder='Enter Value'>
          </Form.Control>
        </Form.Group>
        : (gameSetting === "Victories") ?
          <Form.Group>
            <Form.Label>Victories to Win</Form.Label>
            <Form.Control
              onChange={() => {
                changeDateValue(pointRef.current.value)
              }}
              ref={pointRef}
              type="text"
              placeholder='Enter Value'>
            </Form.Control>
          </Form.Group> : (gameSetting === "Medals") ?
            <Form.Group>
              <Form.Label>Medals to Win</Form.Label>
              <Form.Control
                onChange={() => {
                  changeDateValue(pointRef.current.value)
                }}
                ref={pointRef}
                type="text"
                placeholder='Enter Value'>
              </Form.Control>
            </Form.Group> : null
      }


      <Form.Group>
        <Form.Label>What is the entrance fee for this challenge?</Form.Label>
        <InputGroup className="mb-2 mr-sm-2">
          <InputGroup.Prepend>
            <InputGroup.Text>NEAR</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl ref={entranceFeeRef} id="entrance fee" placeholder="enter NEAR amount" />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Hero Specific or Not?</Form.Label>
        <Form.Control onChange={() => { (heroSpecific !== 'Any Hero') ? changeHeroSpecific('Any Hero') : changeHeroSpecific('Specific Hero') }} as="select">
          <option>Any Hero</option>
          <option>Specific Hero</option>
        </Form.Control>
      </Form.Group>

      {(heroSpecific === 'Specific Hero') ?
        <Form.Group>
          <Form.Label>Choose your Hero</Form.Label>
          <Form.Control onChange={() => { console.log(heroRef.current.value) }} ref={heroRef} as="select">
            {overwatchHeroes.map((x) => {
              return (<option>{x}</option>)
            })}
          </Form.Control>
        </Form.Group> : null
      }
      {
        (publicOrPrivate === 'Private') ?
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Enter Player Near Account Names Separated by Commas (example: blockheads.testnet,underdog3000.testnet)</Form.Label>
            <Form.Control ref={participantRef} as="textarea" rows={3} />
          </Form.Group> : <Form.Group controlId="Challenge Start Date">
            <Form.Label>What day would you like your challenge to begin?</Form.Label>
            <Form.Control
              onChange={() => {
                changeDateValue(dateRef.current.value)
              }}
              ref={dateRef}
              type="text"
              placeholder='enter date dd/mm/yyyy ex 03/12/2020'>
            </Form.Control>
            <Form.Label>What time would you like your challenge to begin?</Form.Label>
            <Form.Control
              as="select"
              placeholder='enter time dd/mm/yyyy'>
              {
                (dateValue === currentDate) ? availiableHours.map((x) => { return (<option>{x}</option>) }) : allHours.map((x) => { return (<option>{x}</option>) })
              }
            </Form.Control>
          </Form.Group>


      }
      <Container>
        <Row className="d-flex justify-content-center">
          <Button disabled={submitStatus} onClick={() => { sendToBlockChain() }}>Submit</Button>

        </Row>
      </Container>
    </Form>
    </Row>
    </Container>


  );
};


export default NewChallenge;
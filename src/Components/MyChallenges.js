import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Container, Row, Col, Button } from 'react-bootstrap'

const MyChallenges = props => {

    // Participating Challengengs 
    const [challengeList, changeChallengeList] = useState([]);
    const [challengeDetails, changeChallengeDetails] = useState([]);
    const [getStatusList, changeStatusList] = useState([])
    const [privateOrPublicList, changePrivatOrPublicList] = useState([]);
    const [challengeFees, changeChallengeFees] = useState([]);
    const [acceptedChallenges, changeAcceptedChallenges] = useState([]);



    //Owners Challenges 

    const [ownersChallengeList, changeOwnersChallengeList] = useState([]);
    const [ownerChallengeDetails, changeOwnerChallengeDetails] = useState([]);
    const [getOwnerWinner, changeGetOwnerWinners] = useState([]);
    const [getOwnerChallengeEndConditions, changeOwnerEndConditions] = useState([])
    const [ownerType, changeOwnerType] = useState([])
    const [ownerPrize,changeOwnerPrize]=useState([])
    const [numberOfParticipants,changeNumberOfParticipants]=useState([]);


    useEffect(() => {
        const getChallengeList = async () => {
            let challengeNames = await window.contract.getChallengerChallenges({ challenger: window.accountId })

            changeChallengeList(challengeNames)

        }
        getChallengeList();

    }, [])



    useEffect(() => {
        const getDetails = async () => {
            let challengeNames = await window.contract.getChallengerChallenges({ challenger: window.accountId })
            let challengeDetailsStore = [];
            let statusList = []
            let pOrPList = [];
            let entranceFees = []
            let acceptedChallengesList = []

            for (const x of challengeNames) {
                let details = await window.contract.getChallengeDetails({ title: x })
                let participantList = await window.contract.getParticipantList({ title: x })
                let statusListFromChain = await window.contract.getParticipantStatus({ title: x });
                let userIndex = participantList.indexOf(window.accountId)
                let acceptedChallengeStatus = await window.contract.checkAcceptedChallenges({name:window.accountId,title:x})

                challengeDetailsStore.push(details[3])
                pOrPList.push(details[4])
                entranceFees.push(details[2])
                statusList.push(statusListFromChain[userIndex])
                acceptedChallengesList.push(acceptedChallengeStatus)

                console.log(details)





            }

            changeChallengeDetails(challengeDetailsStore)
            changePrivatOrPublicList(pOrPList)
            changeStatusList(statusList)
            changeChallengeFees(entranceFees)
            changeAcceptedChallenges(acceptedChallengesList)
        }
        getDetails()
    }, [])



    useEffect(() => {
        const getOwnerChallengeList = async () => {
            let ownerChallengeNames = await window.contract.getOwnersChallenges({ name: window.accountId });
            let ownerChallengeInfo = [];
            let ownerWinnersList = [];
            let ownerChallengeEndConditions = [];
            let ownerChallengeType = [];
            let ownerPrizeList=[]
            let ownerChallengeNumbers=[]
            changeOwnersChallengeList(ownerChallengeNames);

            for (const y of ownerChallengeNames) {
                let ownerDetails = await window.contract.getChallengeDetails({ title: y })
                let escrowValue= await window.contract.getEscrowAccountVal({title:y})
                let ChallengeNumber=await window.contract.getParticipantCount({title:y})
                ownerChallengeInfo.push(ownerDetails[3])
                ownerWinnersList.push(ownerDetails[4])
                ownerChallengeEndConditions.push(ownerDetails[1])
                ownerChallengeType.push(ownerDetails[0])
                ownerPrizeList.push(escrowValue)
                ownerChallengeNumbers.push(ChallengeNumber)
            }
            changeOwnerChallengeDetails(ownerChallengeInfo)
            changeOwnerEndConditions(ownerChallengeEndConditions)
            changeOwnerType(ownerChallengeType)
            changeOwnerPrize(ownerPrizeList)
            changeNumberOfParticipants(ownerChallengeNumbers)

        }
        getOwnerChallengeList()
    }, [])

    const deleteChallenge=async(challengetitle)=>{
        console.log('deleting'+challengetitle)
       await  window.contract.cancelChallenge({title:challengetitle})
    }

    const acceptChallenge = async(title, entranceFeeAmount) => {
        console.log(typeof(entranceFeeAmount))
        console.log('accepting challenge:'+title)
        console.log('sending'+entranceFeeAmount+'to escrow account to hold until challenge concludes')
        console.log('sending Money to the Escrow Account')
        console.log(window.utils.format.parseNearAmount(entranceFeeAmount)+'NEAR')

       await window.account.sendMoney(props.escrow, window.utils.format.parseNearAmount(entranceFeeAmount))
       await  window.contract.addToEscrowAccount({ title: title, amount: Number(entranceFeeAmount) })
       await  window.contract.addToAcceptedChallenges({title:title})
       await  window.contract.addToParticipantCount({title:title})
        alert('Money Sent! Challenge Accepted ')
    }

    const startChallengeButton = async (cTitle, cType, cEndCondition) => {
        console.log(cType)
        //export function startChallenge(title:string,endCondition:i32,startStatus:i32[],participants:string[]):void{

        // step one get the initial values for the type of challenge
        // get participant list



        let cParticipants = await window.contract.getParticipantList({ title: cTitle })

        // Now get a list of battle tags 
        let startingScore = [];



        // build start stat array 
        for (let i = 0; i < cParticipants.length; i++) {
            let startScore = 0;
            let battleTag = await window.contract.getBattleTags({ name: cParticipants[i] })
            console.log(cParticipants[i])



            await fetch(`https://ovrstat.com/stats/pc/${battleTag}`)
                .then(res => res.json())
                .then(res => {
                    startScore = res.quickPlayStats.careerStats.allHeroes.combat[cType]
                }
                )

            console.log(typeof (startScore))
            startingScore.push(startScore)

        }

        let getStatuses = await window.contract.getParticipantStatus({ title: cTitle })



        let currStat = [];
        for (let i = 0; i < getStatuses.length; i++) {
            console.log(getStatuses)
            currStat.push('active')

        }
        console.log(currStat)
        await window.contract.updateParticipantStatus({ title: cTitle, status: currStat })
        await window.contract.activateChallenge({title:cTitle})

        // now that we have the battle tags we need to build the starting value array 

        // after the starting value array build out the function 
        //export function startChallenge(title:string,endCondition:i32,startStatus:i32[],participants:string[]):void{

        // update the challenge status
        console.log('starting score is:')
        console.log(startingScore)

        await window.contract.startChallenge({ title: cTitle, endCondition: Number(cEndCondition), startStatus: startingScore, participants: cParticipants })
        console.log('challenge Started')


    }

    return (
        <Container>
            <Row className='d-flex justify-content-center'>
                <Table style={{ marginTop: '10%', width: '80vw' }} striped bordered hover variant="dark">
                    <thead>
                        <th colSpan={6} >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                Challenges The User Is Participating In
          </div>

                        </th>

                        <tr>
                            <th>#</th>
                            <th>Challenge Name</th>
                            <th>Challenge Status</th>
                            <th>Private or Public</th>
                            <th>Entrance Fee</th>
                            <th>Challenge Response</th>



                        </tr>
                    </thead>
                    <tbody>

                        {challengeList.map((x, index) => {
                            return (

                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{x}</td>
                                    <td>{challengeDetails[index]}</td>
                                    <td>{privateOrPublicList[index]}</td>
                                    <td>{(challengeFees[index])?challengeFees[index]:'--'} Near</td>
                                    {console.log(getStatusList[index])}
                                    <td className="d-flex justify-content-center">{(getStatusList[index] === undefined) ? 'N/A' :
                                        (getStatusList[index] === 'pending') ?
                                            ((!acceptedChallenges[index]) ? (
                                                <React.Fragment className="d-flex justify-content-center"><Button onClick={() => acceptChallenge(x,challengeFees[index]) } variant="primary">Enter!</Button>
                                                    <Button onClick={async () => { window.contract.removeFromChallengerList({ title: x }) }} variant="danger">Reject</Button></React.Fragment>) : 'Challenge Accepted! Entrance Fee Sent')
                                            : 'Challenge Started'
                                    }
                                    </td>



                                </tr>
                            )
                        })}




                    </tbody>
                </Table>



                <Table style={{ marginTop: '10%', width: '80vw' }} striped bordered hover variant="dark">
                    <thead>
                        <th colSpan={7} >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                Challenges the user Owns
          </div>

                        </th>
                        <tr>
                            <th>#</th>
                            <th>Challenge Name</th>
                            <th>Challenge Status</th>
                            <th>Challenge End Condition</th>
                            <th>Challenge Winners</th>
                            <th>Challenge Start Button</th>
                            <th>Challenge Prize Total</th> 
                            <th>Number of Participants</th>
                        </tr>
                    </thead>
                    <tbody>


                        {ownersChallengeList.map((x, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{x}</td>
                                    <td>{ownerChallengeDetails[index]}</td>
                                    <td>{getOwnerChallengeEndConditions[index]}</td>
                                    <td>{(getOwnerWinner[index] === undefined) ? 'N/A' : getOwnerWinner[index]}</td>
                                    <td className="d-flex justify-content-center"><Button onClick={()=>{startChallengeButton(x,ownerType[index],getOwnerChallengeEndConditions[index])}} variant="success">Begin Challenge</Button><Button onClick={()=>deleteChallenge(x)} variant="danger">Cancel Challenge</Button></td>
                                    <td>{ownerPrize[index]}</td>
                                    <td>{numberOfParticipants[index]}</td>
                                </tr>
                            )
                        })}


                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

MyChallenges.propTypes = {

};

export default MyChallenges;
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Container, Row, Col } from 'react-bootstrap'

const MyChallenges = props => {

    // Public Challengengs 
    const [challengeList, changeChallengeList] = useState([]);
    const [challengeDetails, changeChallengeDetails] = useState([]);


    //Owners Challenges 

    const [ownersChallengeList,changeOwnersChallengeList]=useState([]);
    const [ownerChallengeDetails,changeOwnerChallengeDetails]=useState([]);
    const [getOwnerWinner,changeGetOwnerWinners]=useState([]);


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
            let challengeDetails1 = [];

            for (const x of challengeNames) {
                let details = await window.contract.getChallengeDetails({ title: x })
                console.log(details)
                challengeDetails1.push(details[3])

            }

            console.log(challengeDetails1)
            changeChallengeDetails(challengeDetails1)
        }
        getDetails()
    }, [])

    useEffect(()=>{
        const getOwnerChallengeList=async()=>{
            let ownerChallengeNames= await window.contract.getOwnersChallenges({name:window.accountId});
            let ownerChallengeInfo= [];
            let ownerWinnersList=[];
            changeOwnersChallengeList(ownerChallengeNames);

            for (const y of ownerChallengeNames){
                let ownerDetails=await window.contract.getChallengeDetails({title:y})
                ownerChallengeInfo.push(ownerDetails[3])
                ownerWinnersList.push(ownerDetails[4])
                
            }
            console.log(ownerChallengeInfo)
            changeOwnerChallengeDetails(ownerChallengeInfo)

        }
        getOwnerChallengeList()
    },[])

    return (
        <Container>
            <Row className='d-flex justify-content-center'>
                <Table style={{ marginTop: '10%', width: '80vw' }} striped bordered hover variant="dark">
                    <thead>
                        <th colSpan={4} >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                Challenges The User Is Participating In
          </div>

                        </th>

                        <tr>
                            <th>#</th>
                            <th>Challenge Name</th>
                            <th> Challenge Status</th>

                        </tr>
                    </thead>
                    <tbody>

                        {challengeList.map((x, index) => {
                            return (

                                <tr>
                                    <td>{index}</td>
                                    <td>{x}</td>
                                    <td>{challengeDetails[index]}</td>
                                    


                                </tr>
                            )
                        })}




                    </tbody>
                </Table>



                <Table style={{ marginTop: '10%', width: '80vw' }} striped bordered hover variant="dark">
                    <thead>
                        <th colSpan={4} >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                Challenges the user Owns
          </div>

                        </th>
                        <tr>
                            <th>#</th>
                            <th>Challenge Name</th>
                            <th> Challenge Status</th>
                            <th>Challenge Winners</th>
                        </tr>
                    </thead>
                    <tbody>


                        {ownersChallengeList.map((x,index)=>{
                         return(   
                         <tr>
                                <td>{index}</td>
                                <td>{x}</td>
                                <td>{ownerChallengeDetails[index]}</td>
                                
                                <td>{(getOwnerWinner[index]===undefined)?'N/A':getOwnerWinner[index]}</td>
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
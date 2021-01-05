import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container, Row, Col, Jumbotron, Table, ProgressBar } from 'react-bootstrap';
import Api from './Api'
import PlayerView from './PlayerView'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

const Stream = (streamer) => {
    console.log(streamer)
    return (
        <div>
            <TwitchPlayer
                channel={streamer}
                id={streamer}
                theme="dark"


            />


        </div>
    );
}

const TwitchViewHome = props => {

    const [games, setGames] = useState();
    const [participants, changeParticipants] = useState(['emongg', 'jake_ow'])
    const [streamer, changeSteamer] = useState(participants[0])
    const [channel,changeChannel]=useState(1)
    
    const streams=participants.map((x,index)=>{
        return(
            
            <TwitchPlayer
                channel={streamer}
                id={streamer}
                theme="dark"
            />
        )
    })




    useEffect(() => {
        const getGames = async () => {
            const result = await Api.get("https://api.twitch.tv/helix/search/channels?query=a_seagull")
            console.log(result)
        }
        getGames();
    }

        , [])

    useEffect(() => {

    }, [channel])




    return (
            <Jumbotron fluid style={{ borderRadius: "10px", padding: '5px' }}>
                <Container>
                    <Row className="d-flex justify-content-center"><h1>Featured Match</h1></Row>
                    <Row className="d-flex justify-content-center">
                    <TwitchPlayer
                channel={streamer}
                id={streamer}
                theme="dark"
            />
                    </Row>
                    <Row style={{ marginTop: '10px' }} className="d-flex justify-content-center">



                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Team Name</th>
                                    <th>Current Team Progress</th>
                                    <th>Twitch Stream</th>

                                </tr>
                            </thead>
                            <tbody>

                                {participants.map((x, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{x}</td>

                                            <td className="align-middle" style={{ backgroundColor: 'black', textAlign: 'center' }}>
                                                <ProgressBar now={75}></ProgressBar>
                                            </td>

                                            <td style={{ textAlign: 'center', alignItems: 'center' }} >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                <Button onClick={()=>{console.log(streams);changeChannel(index)}}>Twitch Stream</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}



                            </tbody>
                        </Table>

                    </Row>
                    <Row className="d-flex justify-content-center">
                       <Button >Create A New Challenge</Button>
                    </Row>
                </Container>
            </Jumbotron>
    );
};

TwitchViewHome.propTypes = {

};

export default TwitchViewHome;
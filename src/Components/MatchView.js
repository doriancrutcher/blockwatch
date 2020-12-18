import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Table,Container,Row} from 'react-bootstrap'

const MatchView = props => {

const [winners,changeWinners]=useState(['Dorgon108'])
const [challenge,changeChallenge]=useState(['Participation Award'])

    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr> 
                    <th>#</th>
                    <th> Challenge Name </th>
                    <th> Winner </th>
                   
                </tr>
            </thead>

            <tbody>
            {winners.map((x,index)=>{
                return(
                    <tr>
                        <td>{index}</td>
                        <td>{x}</td>
                        <td>{challenge[index]}</td>
                    </tr>
                )
            })}
            </tbody>
           
        </Table>

    );
};

MatchView.propTypes = {
    
};

export default MatchView;
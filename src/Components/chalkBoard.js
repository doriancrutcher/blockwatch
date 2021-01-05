const startChallengeButtton = async (cTitle, cEndCondition) => {

    let battleTags = [];
    let startVal = [];


    let cParticipants = await window.contract.getParticipantList({ title: cTitle })

    for (let i = 0; i < cParticipants.length; i++) {

        let battletag = await window.contract.getBattleTags({ name: cParticipants[i] })
        console.log(battletag)
        const data = await fetch("https://ow-api.com/v1/stats/pc/us/dorgon108-1679/profile")
            .then(res => res.json())
            .then(res => console.log(res))
    }

    window.contract.startChallenge({ title: cTitle, endCondition: Number(cEndCondition), startStatus:, participants: cParticipants })
    //export function startChallenge(title:string,endCondition:i32,startStatus:i32[],participants:string[]):void{


    let getStatuses = await window.contract.getParticipantStatus({ title: cTitle })



    let currStat = [];
    getStatuses.forEach(x => {
        currStat.push('active')
    })
    window.contract.updateParticipantStatus({ title: cTitle, status: currStat })



}

const startChallengeButton = async (cTitle,cType) => {
    //export function startChallenge(title:string,endCondition:i32,startStatus:i32[],participants:string[]):void{

    // step one get the initial values for the type of challenge
    // get participant list

    const data = await fetch("https://ovrstat.com/stats/pc/Viz-1213")
        .then(res => res.json())
        .then(res => console.log(res))

    let cParticipants = await window.contract.getParticipantList({ title: cTitle })

    // Now get a list of battle tags 
    let battleTags=[]
    let startingScore=[];



    // build start stat array 
    for (let i = 0; i < cParticipants.length; i++) {
        let startScore=0;
        let battleTag= await window.contract.getBattleTags({ name: cParticipants[i] }) 
        console.log(battleTag)
        


        await fetch(`https://ovrstat.com/stats/pc/${battleTag}`)
        .then(res => res.json())
        .then(res =>{ 
            console.log(battleTag)
            console.log(res)
            startScore.push(res.quickPlayStats.careerStats.allHeroes.combat.cType)}
            )
        
        startingScore.push(startScore)

    }

    // now that we have the battle tags we need to build the starting value array 



}
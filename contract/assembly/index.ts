
import { Context, logging, PersistentMap, storage,env } from 'near-sdk-as'

//Account Tracking
let BattleTags = new PersistentMap<string, string>("battleTag");
let TwitchHandles = new PersistentMap<string, string>("twitchHandle");
let watchTokens = new PersistentMap<string,i32>("Watch Tokens")

// Challenge Tracking
let challengeIdMap = new PersistentMap<string, string[]>("challengeIDMap")
let ownerMap = new PersistentMap<string, string[]>("Owner Map");
let challengerMap = new PersistentMap<string, string[]>("Challenger Map");
let acceptedChallenges= new PersistentMap<string,string[]>('List of accepted challenges')
let challengeWinners = new PersistentMap<string,string>('challenge winners ')


let privateParty = new PersistentMap<string, string[]>("privatePartyList");
let participantStatus=new PersistentMap<string,string[]>("participant Status")
let challengeLibrary= new PersistentMap<string,string[]>("ChallengeLibrary");
let endPointsReg=new PersistentMap<string,i32[]>('points array');
let escrowManager=new PersistentMap<string,i32>('Escrow Account to Hold Competition Funds')


let enteredParticipantsCount=new PersistentMap<string, string[]>('Count of Participants ')
let partyParticipants= new storage



//Winner Logs
let winnerLog=new PersistentMap<string, string>('Winner Log');




// Set Battle Tags and Twitch Handles 
export function setTag(TagName: string): void {
  if (TagName.includes("#")) {
    let splitName = TagName.split("#")
    let reformattedName = splitName[0] + "-" + splitName[1]
    logging.log('reformatting name to:')
    logging.log(reformattedName)
    BattleTags.set(Context.sender, reformattedName)
  }
  else {
    logging.log('please follow the format shown above')
  }
}

export function setTwitch(TwitchHandle: string): void {
  TwitchHandles.set(Context.sender, TwitchHandle)
  logging.log(`Twitch handle for ${Context.sender} set to ${TwitchHandle}`)
}


// Get Battle Tags and Twitch Handle

export function getBattleTags(name: string): string {
  if (BattleTags.contains(name)) {
    return BattleTags.getSome(name)
  } else {
    return ""
  }
}
export function getTwitchHandle(name: string): string {
  if (TwitchHandles.contains(name)) {
    return TwitchHandles.getSome(name)
  } else {
    return ""
  }
}

// Check Registry 
export function CheckTags(name: string): boolean {
  if (BattleTags.contains(name)) {
    logging.log('BattleTag Exists!')
    return true
  }
  else {
    logging.log('Battle Tag Does Not Exist!')
    return false
  }
}

// //----------------------------------- Challenge Owner and Participant Tracking Writing------------------------------------------------//

export function addToChallengeIds(title: string): void {
  if (challengeIdMap.contains('allChallenges')) {
    let getCurrList = challengeIdMap.getSome('allChallenges')
    getCurrList.push(title)
    challengeIdMap.set('allChallenges', getCurrList)
  } else {
    challengeIdMap.set('allChallenges', [title])
  }

}


export function getChallengeLength(): i32 {
  if (challengeIdMap.contains('allChallenges')) {
    let getList = challengeIdMap.getSome('allChallenges')
    return getList.length
  } else {
    return 1
  }
}

export function addToChallengeMap(title: string, type: string, endCondition: string, entranceFee: string, challengeStatus: string, privateOrPublic:string): void {
  // This should be enough to add new challenges to the list 
  logging.log('Adding Challenge, I will let you know if anything is wrong')
  logging.log('the title is')
  logging.log(title)
  if (challengeLibrary.contains(title)) {
    logging.log('challenge title established')
  } else {
    challengeLibrary.set(title, [type, endCondition, entranceFee, challengeStatus,privateOrPublic])
  }
}

export function activateChallenge(title:string):void{
  if (challengeLibrary.contains(title)){
    let details =challengeLibrary.getSome(title)
    details[3]='started'
    logging.log('challenge Started!')
    challengeLibrary.set(title,details)
  }else{
    logging.log('Challenge Not Found')
  }
}

export function addToOwnerMap(title: string): void {
  if (ownerMap.contains(Context.sender)) {
    let getList = ownerMap.getSome(Context.sender) // retreive list and store challenge list into variable 
    getList.push(title)
    ownerMap.set(Context.sender, getList)
  } else {
    ownerMap.set(Context.sender, [title])
  }
}

export function addToChallengerMap(challenger: string, title: string): void {
  if (challengerMap.contains(challenger)) {
    let getList = challengerMap.getSome(challenger) // retreive list and store challenge list into variable 
    getList.push(title)
    challengerMap.set(challenger, getList)
  } else {
    challengerMap.set(challenger, [title])
  }

}

export function addToPrivateParty(title: string, participants: string[]): void {
  privateParty.set(title, participants)
  let status:Array<string>=[];
 for ( let x=0; x< participants.length;x++){
    status.push('pending')
    logging.log('adding to private party')
 }
 logging.log('adding to private party under title')
 logging.log(title)
  participantStatus.set(title,status)
}

export function getParticipantList(title:string):string[]{
  if (privateParty.contains(title)){
  return privateParty.getSome(title)
  }else{
    logging.log('no user list found, please add usernames to list')
    return []
  }
}


export function updateParticipantStatus(title:string,status:string[]):void{
participantStatus.set(title,status)
}


export function getParticipantStatus(title:string):string[]{
  if(participantStatus.contains(title)){
  return participantStatus.getSome(title)}
  else{
    logging.log('not Found')
    return[]
  }
  }

// export function setInitParticipantStatus(title:string,name:string,status:string):void{
//   let obj= new ParticipantStatusClass(name,status)
//   storage.set<ParticipantStatusClass>(title,obj);
// }


//----------------------------Challenge Owner and Participants Reading -------------------- // 



export function sayHi(): string {
  return 'hi'
}

// -----------------------------Get List of Challenge Names -----------------//

export function getChallengerChallenges(challenger: string): string[] {
  if (challengerMap.contains(challenger)) {
    return challengerMap.getSome(challenger)
  } else {
    return ['no challenges']
  }

}

export function getChallengeDetails(title: string): string[] {
  if (challengeLibrary.contains(title)) {
    logging.log('I found it!')
    return challengeLibrary.getSome(title)
  } else {
    logging.log('no luck chuck')
    return []
  }

}


export function getOwnersChallenges(name:string):string[]{
  if(ownerMap.contains(name)){
    return ownerMap.getSome(name)
  }else{
    logging.log('This does not exist in the owners challenge inventory')
    return []
  }
}


// ----------------------------------- Winner Logs --------------------------------// 

export function addToWinnerLog(name:string,title:string):void{
  if(winnerLog.contains(title)){
    logging.log('winner already exists')
  }else{
    logging.log('congradulations to....')
    logging.log(title)
    winnerLog.set(title,name)
  }
}


// ---------------------------Challenge Managment Functions ----------------------------// 

export function addToChallengeWinners(challengeTitle:string,user:string):void{
  if(challengeWinners.contains(challengeTitle)){
    logging.log('this challenge already has a winner declared')
  }else{
    logging.log('adding the winner to this challenge, congrats to the winner! ')
    challengeWinners.set(challengeTitle,user)
  }
}

export function getChallengeWinnerName(challengeTitle:string):string{
  if(challengeWinners.contains(challengeTitle)){
    logging.log('winner found')
    return challengeWinners.getSome(challengeTitle)
  }else{
    logging.log('user not found')
    return 'N/A'
  }
}

export function startChallenge(title:string,endCondition:i32,startStatus:i32[],participants:string[]):void{
// The way I think this will work is that we will use the participants array of which's key is the name of the challenge and use the indicies of that array to map out another one
// in this second array the title will also be the key that will give an array of i32 arrays, where in this second array will hold their starting value and their current value from that starting value
// once the difference is equal to the endcondition that is when the challenge will stop.
// participants ['dorian','chad']

let endPointsArray:i32[]=[];

  for ( let x=0; x<participants.length;x++ ){
  // x will be a string of names but what I care about are the indciies 
  // this array will store this individua players personal endcondition 
  
  logging.log('setting end condition for:')
  logging.log(x)
  let finalValue=startStatus[x]+endCondition
  
  endPointsArray.push(finalValue)

}
//participants array 
// ['dorian.testnet, chad.testnet]
// [356, 424]
endPointsReg.set(title,endPointsArray)

// update challenge status to active

let challengeDetails=challengeLibrary.getSome(title)
logging.log(challengeDetails[3])
challengeDetails[3]='started'
challengeLibrary.set(title,challengeDetails)

}

export function getStartedChallengeStats(title:string):i32[]{
  if(endPointsReg.contains(title)){
    return endPointsReg.getSome(title)
  }else{
    return []
  }
}

export function removeChallenges(title:string):void{

let listOfChallengers = privateParty.getSome(title)

for (let x=0; x<listOfChallengers.length;x++){
  logging.log(listOfChallengers[x])
if (challengerMap.contains(listOfChallengers[x])) {
  let getList = challengerMap.getSome(listOfChallengers[x]) // retreive list and store challenge list into variable 
  if(getList.indexOf(title)){
  let index= getList.indexOf(title)
  getList.splice(index,1)
  logging.log('removing'+listOfChallengers[x]+'from challenger list')
  challengerMap.set(listOfChallengers[x], getList)}
} }

challengeIdMap.delete(title)
privateParty.delete(title)
participantStatus.delete(title)
challengeLibrary.delete(title)
endPointsReg.delete(title)
logging.log('Removing from ID Map Owner Map Private Party Participant Status the challenge library')

}

export function cancelChallenge(title:string):void{
  let getList=ownerMap.getSome(Context.sender)
  getList.splice(getList.indexOf(title),1)
  ownerMap.set(Context.sender,getList)
}

export function removeFromChallengerList(title:string,challenger:string):void{

    let getList = challengerMap.getSome(challenger) // retreive list and store challenge list into variable 
    let index= getList.indexOf(title)
    getList.splice(index,1)
    logging.log('removing'+challenger+'from challenger list')
    challengerMap.set(challenger, getList)
  

}

export function addToEscrowAccount(title:string,amount:i32):void{
  if(escrowManager.contains(title)){
    let currentVal=escrowManager.getSome(title)
    let finalVal=amount+currentVal
    escrowManager.set(title,finalVal)
    logging.log('value added to escrow account')
  }else{
    logging.log('initial value added to escrow account')

    escrowManager.set(title,amount)
  }

}

export function getEscrowAccountVal(title:string):i32{
  if(escrowManager.contains(title)){
    logging.log('retreiving value')
    return escrowManager.getSome(title)
  }else{
    logging.log('no title found')
    return 0
  }
}

export function addToAcceptedChallenges(title:string):void{
  logging.log('checking registry for user')
  if(acceptedChallenges.contains(Context.sender)){
    logging.log('user found adding to list')
    let currListOfAcceptedChallenges= acceptedChallenges.getSome(Context.sender)
    currListOfAcceptedChallenges.push(title)
     acceptedChallenges.set(Context.sender,currListOfAcceptedChallenges)
  }else{
    acceptedChallenges.set(Context.sender,[title])
  }
}

export function checkAcceptedChallenges(name:string,title:string):bool{
  let getList=acceptedChallenges.getSome(name)
  return getList.includes(title)
}

export function addToParticipantCount(title:string):void{
  if(enteredParticipantsCount.contains(title)){
   let getList=enteredParticipantsCount.getSome(title)
    if(getList.includes(Context.sender)){
      logging.log(`You've already entered this challenge silly goose`)
    }else{
      logging.log('adding user')
      getList.push(Context.sender)
    }
  }else{
    enteredParticipantsCount.set(title,[Context.sender])
  }

}

export function getParticipantCount(title:string):i32{
  if(enteredParticipantsCount.contains(title)){
    let getList=enteredParticipantsCount.getSome(title)
    return getList.length
  }else{
    logging.log('challenge not found')
    return 0
  }
}

export function getParticipantCountMembers(title:string):string[]{
if(enteredParticipantsCount.contains(title)){
  logging.log('retreiving participants')
  return enteredParticipantsCount.getSome(title)
}else{
  logging.log('challenge not found')
  return []
}
}



// ----------------------------------------- User Token Tracking --------------------------------------// 

export function addWatchTokens(user:string, amount:i32):void{
  if (watchTokens.contains(user)){
    let currAmount=watchTokens.getSome(user)
    let newAmount=currAmount+amount
    watchTokens.set(user,newAmount)
    logging.log('user found adding  funds to user ')
  }else{  
    logging.log(' user not found. Adding new ')
    watchTokens.set(user,amount)
  }
}


export function removeWatchTokens(user:string, amount:i32):void{
  if(watchTokens.contains(user)){
    let currAmount=watchTokens.getSome(user)
    if(currAmount>amount){
       let newAmount=currAmount-amount
       watchTokens.set(user,newAmount)
    }else{
      logging.log('user does not have enough Tokens')
    }
  }
  else{
    logging.log('user does not exist ')
  }
}

export function sendWatchTokens(recipient:string,amount:i32):void{
  if(watchTokens.contains(recipient)){
    let currAmount=watchTokens.getSome(recipient)
    if(currAmount>amount){
       let newAmount=currAmount-amount
       watchTokens.set(Context.sender,newAmount)
       watchTokens.set(recipient,amount)
    }else{
      logging.log('user does not have enough Tokens')
    }
  }
  else{
    logging.log('user does not exist ')
  }
}

export function retreiveTokenAmount(user:string):i32{
  if (watchTokens.contains(user)){
    return watchTokens.getSome(user)
  }else{
    logging.log('user does not exist')
    return 0
  }
}


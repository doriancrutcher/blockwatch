
import { Context, logging, PersistentMap, storage } from 'near-sdk-as'

//Account Tracking
let BattleTags = new PersistentMap<string, string>("battleTag");
let TwitchHandles = new PersistentMap<string, string>("twitchHandle");

// Challenge Tracking
let challengeIdMap = new PersistentMap<string, string[]>("challengeIDMap")
let ownerMap = new PersistentMap<string, string[]>("Owner Map");
let challengerMap = new PersistentMap<string, string[]>("Challenger Map");
let privateParty = new PersistentMap<string, string[]>("privatePartyList");
let challengeLibrary= new PersistentMap<string,string[]>("ChallengeLibrary");

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

export function addToChallengeMap(title: string, type: string, endCondition: string, entranceFee: string, challengeStatus: string): void {
  // This should be enough to add new challenges to the list 
  logging.log('Adding Challenge, I will let you know if anything is wrong')
  logging.log('the title is')
  logging.log(title)
  if (challengeLibrary.contains(title)) {
    logging.log('challenge title established')
  } else {
    challengeLibrary.set(title, [type, endCondition, entranceFee, challengeStatus])
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
}



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
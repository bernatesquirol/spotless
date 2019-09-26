import { CHROME_ACTIONS as actionTypes } from '../constants/actionTypes'

export default (state = { }, action) => {
  if (action.type === actionTypes.MUTE) {
    chrome.windows.getAll({populate:true},function(windows){
        windows.forEach((window)=>{
            window.tabs.forEach(tab => {
                let regexDomain = tab.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                if (regexDomain!=null && regexDomain.length>1 && regexDomain[1]=="open.spotify.com"){
                  chrome.tabs.update(tab.id, { muted: action.mute });  
                  console.log('Muted', tab.title, action.mute)
                }
            });
        })
    })
    
  }
  return state;
}
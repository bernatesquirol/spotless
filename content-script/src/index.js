import { Store, applyMiddleware } from 'react-chrome-redux'
import thunkMiddleware from 'redux-thunk';
import { getPlaybackData, onVolumeMuteToggle } from './actions/player'

const store = new Store({
  portName: 'spotless'
})

const middleware = [thunkMiddleware];
const storeWithMiddleware = applyMiddleware(store, ...middleware);

storeWithMiddleware.ready().then(() => {
  let muting = false
  const observer = new MutationObserver(() => {
    // const urlContainsAds = document.querySelector('.now-playing a').href.includes('ad');
    const artistIsSpotify = document.querySelector('.track-info__artists a').text === 'Spotify'
    const trackNameIsAds = document.querySelector('.track-info__name a').text === 'Advertisement'
    const titleContainsAds = document.title.includes('Advertisement')
    const allProgressTime = document.querySelectorAll('.playback-bar__progress-time')
    const shortSong = allProgressTime!=null
      && allProgressTime.length>1 && allProgressTime[1].textContent!=null
      && allProgressTime[1].textContent.split(':').length==2
      && parseInt(allProgressTime[1].textContent.split(':')[0])<1
      && parseInt(allProgressTime[1].textContent.split(':')[1])<31
    console.log('check',artistIsSpotify,trackNameIsAds,titleContainsAds,shortSong)
    if (artistIsSpotify || trackNameIsAds || titleContainsAds || shortSong) {
      if (!muting) {
        store.dispatch({type:'MUTE', mute:!muting}).then(()=>{
          muting = true
          store.dispatch(getPlaybackData())
            .then(() => {
              store.dispatch(onVolumeMuteToggle())              
        }) 
      })
    }
    } else {
      if (muting) {
        store.dispatch({type:'MUTE', mute:!muting}).then(()=>{
          muting = false
          store.dispatch(onVolumeMuteToggle())
        })
      }
    }
  })

  const interval = setInterval(() => {
    const trackInfoElement = document.querySelector('.track-info')

    if (trackInfoElement) {
      clearInterval(interval)
      observer.observe(trackInfoElement, { childList: true, subtree: true, attributes: true })
    }
  }, 1000);
})

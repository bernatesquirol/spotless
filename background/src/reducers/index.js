import { combineReducers } from 'redux'
import menubar from './menubar'
import player from './player'
import search from './search'
import auth from './auth'
import chrome from './chrome'

const rootReducer = combineReducers({
  menubar,
  player,
  search,
  auth,
  chrome
})

export default rootReducer
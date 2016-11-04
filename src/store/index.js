import { createStore, applyMiddleware, combineReducers } from 'redux'
import operatorMiddleware from '../middlewares/socket-io'
import chatlistMiddleware from '../middlewares/socket-io/chatlist'
import broadcastMiddleware from '../middlewares/socket-io/broadcast'
import operatorLoadMiddleware from '../middlewares/socket-io/operator-load'
import operatorReducer from '../operator/store'
import chatlistReducer from '../chat-list/reducer'
import canRemoteDispatch from '../operator/canRemoteDispatch'

export default ( { io, customers, operators, chatlist, middlewares = [], timeout = undefined }, state ) => createStore(
	combineReducers( { operators: operatorReducer(), chatlist: chatlistReducer } ),
	state,
	applyMiddleware(
		operatorMiddleware( io.of( '/operator' ), operators ),
		chatlistMiddleware( { io, customers, operators, events: chatlist, timeout, customerDisconnectTimeout: timeout } ),
		broadcastMiddleware( io.of( '/operator' ), canRemoteDispatch ),
		...operatorLoadMiddleware,
		...middlewares
	)
)

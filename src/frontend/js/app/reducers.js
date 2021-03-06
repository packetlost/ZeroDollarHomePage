import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import claim from '../claim/claimReducers';
import userReducerFactory from '../user/userReducer';
import { reducer as form } from 'redux-form';

const rootReducer = combineReducers({
    claim,
    form,
    routing: routeReducer,
    user: userReducerFactory(window.localStorage),
});

export default rootReducer;

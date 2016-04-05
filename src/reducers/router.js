import { LOCATION_CHANGE } from 'react-router-redux';
import { Map } from 'immutable';

const initialState = Map({
    locationBeforeTransitions: null
});

// router reducer that allows the state tree to be wrapped in an immutable object
export default (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.set('locationBeforeTransitions', action.payload);
    }

    return state;
};

import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';

const initialState = fromJS({
    locationBeforeTransitions: null
});

// router reducer that allows the state tree to be wrapped in an immutable object
export default (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            locationBeforeTransitions: action.payload
        });
    }

    return state;
};

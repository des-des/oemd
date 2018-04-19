export const createReducer = (initialState, reducers) => (
  state = initialState,
  action
) => {
  const reducer = reducers[action.type]

  if (typeof reducer === 'undefined') return state

  return reducer(state, action)
}

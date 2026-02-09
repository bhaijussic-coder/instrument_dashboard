import React, {createContext, useReducer, useContext} from 'react'

const initialState = {
  instruments: [],
  testResults: []
}

function reducer(state, action){
  switch(action.type){
    case 'ADD_INSTRUMENT':
      return {...state, instruments: [...state.instruments, action.payload]}
    case 'ADD_TEST_RESULT':
      return {...state, testResults: [...state.testResults, action.payload]}
    case 'SET_STATE':
      return {...state, ...action.payload}
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({children}){
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={{state,dispatch}}>{children}</StoreContext.Provider>
}

export function useStore(){
  const ctx = useContext(StoreContext)
  if(!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

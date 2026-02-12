import React, {createContext, useReducer, useContext} from 'react'

const INSTRUMENT_CATEGORIES = {
  'Cautery Instruments': [
    'Monopolar Hook',
    'Monopolar Spatula',
    'Mini Cautery Hook',
    'Mini Cautery Spatula',
    'Harmonic Scalpel',
    'Xpert Seal',
    'SeliCut Pro'
  ],
  'Forceps and Retractors': [
    'Maryland Bipolar Forceps',
    'Fenestrated Bipolar Forceps',
    'Black Diamond Micro Forceps',
    'DeBakey Forceps',
    'Prograsp Forceps',
    'Tenaculum Forceps',
    'Grasping Retractor',
    'Long Tip Forceps',
    'Cadiere Forceps',
    'Atrial Retractor Short Right',
    'Atrial Retractor Dual Blade',
    'Resano Forceps',
    'Cardiac Stabilizer',
    'Cardiac Bipolar Forceps',
    'Small Grasping Retractor',
    'Cobra Forceps',
    'Cardiac Probe Grasper',
    'Tipup Fenestrated Retractor',
    'Long Bipolar Grasper',
    'Mini Grasper',
    'Mini Bipolar Forceps',
    'Fine Tissue Forceps',
    'Maryland Dissector'
  ],
  'Specialty Scissors': [
    'Potts Scissors',
    'Round Tip Scissors',
    'Monopolar Curved Scissors',
    'Curved Cold Scissors',
    'Mini Curved Scissor'
  ],
  'Needle Drivers & Others': [
    'Large Needle Driver',
    'Mega Needle Driver',
    'Micro Needle Driver',
    'Ultra Needle Driver',
    'Sevana Cut Needle Driver',
    'Super SeVana(TM) Cut Needle Driver',
    'Small Titanium Clip Applier',
    'Small Polymer Clip Applier',
    'Extra Titanium Clip Applier',
    'Medium Titanium Clip Applier',
    'Medium Polymer Clip Applier',
    'Large Polymer Clip Applier',
    'Multifire Stapler 60',
    'Multifire Stapler 45',
    'Knife',
    'Coronary_Connector'
  ]
}

const INSTRUMENT_METADATA = {
  'Monopolar Hook': { desc: 'Precision cutting & coagulation', category: 'Cautery Instruments' },
  'Maryland Bipolar Forceps': { desc: 'Gentle tissue handling with bipolar capability', category: 'Forceps and Retractors' },
  'Fenestrated Bipolar Forceps': { desc: 'Fenestrated design for improved depth perception', category: 'Forceps and Retractors' },
  'Potts Scissors': { desc: 'Angled blades for precise cutting in tight spaces', category: 'Specialty Scissors' },
  'Large Needle Driver': { desc: 'Heavy-duty suturing instrument', category: 'Needle Drivers & Others' },
  'Black Diamond Micro Forceps': { desc: 'Diamond-coated for superior grip', category: 'Forceps and Retractors' },
  'Harmonic Scalpel': { desc: 'Ultrasonic cutting and coagulation device', category: 'Cautery Instruments' },
  'Prograsp Forceps': { desc: 'Advanced grasping instrument with self-centering design', category: 'Forceps and Retractors' },
  'Cardiac Stabilizer': { desc: 'Specialized cardiac procedure instrument', category: 'Forceps and Retractors' },
  'Micro Needle Driver': { desc: 'Precision micro-suturing instrument', category: 'Needle Drivers & Others' },
  'Small Titanium Clip Applier': { desc: 'Titanium clip application system', category: 'Needle Drivers & Others' }
}

const initialState = {
  instrumentsByCategory: INSTRUMENT_CATEGORIES,
  instrumentMetadata: INSTRUMENT_METADATA,
  instruments: Object.values(INSTRUMENT_CATEGORIES).flat(),
  testResults: [
    // February 2026 data
    { id: 1, instrument: 'Cautery Instruments', status: 'passed', date: new Date(2026, 1, 1) },
    { id: 2, instrument: 'Needle Drivers & Others', status: 'failed', date: new Date(2026, 1, 1) },
    { id: 3, instrument: 'Forceps and Retractors', status: 'passed', date: new Date(2026, 1, 1) },
    { id: 4, instrument: 'Specialty Scissors', status: 'passed', date: new Date(2026, 1, 1) },
    { id: 5, instrument: 'Frequency Counter', status: 'passed', date: new Date(2026, 1, 1) },
    
    { id: 6, instrument: 'Cautery Instruments', status: 'failed', date: new Date(2026, 1, 3) },
    { id: 7, instrument: 'Needle Drivers & Others', status: 'passed', date: new Date(2026, 1, 3) },
    { id: 8, instrument: 'Forceps and Retractors', status: 'passed', date: new Date(2026, 1, 3) },
    { id: 9, instrument: 'Specialty Scissors', status: 'failed', date: new Date(2026, 1, 3) },
    { id: 10, instrument: 'Frequency Counter', status: 'passed', date: new Date(2026, 1, 3) },
    
    { id: 11, instrument: 'Cautery Instruments', status: 'passed', date: new Date(2026, 1, 5) },
    { id: 12, instrument: 'Needle Drivers & Others', status: 'passed', date: new Date(2026, 1, 5) },
    { id: 13, instrument: 'Forceps and Retractors', status: 'failed', date: new Date(2026, 1, 5) },
    { id: 14, instrument: 'Specialty Scissors', status: 'passed', date: new Date(2026, 1, 5) },
    { id: 15, instrument: 'Frequency Counter', status: 'failed', date: new Date(2026, 1, 5) },
    
    { id: 16, instrument: 'Cautery Instruments', status: 'passed', date: new Date(2026, 1, 8) },
    { id: 17, instrument: 'Needle Drivers & Others', status: 'failed', date: new Date(2026, 1, 8) },
    { id: 18, instrument: 'Forceps and Retractors', status: 'passed', date: new Date(2026, 1, 8) },
    { id: 19, instrument: 'Specialty Scissors', status: 'passed', date: new Date(2026, 1, 8) },
    { id: 20, instrument: 'Frequency Counter', status: 'passed', date: new Date(2026, 1, 8) },
    
    { id: 21, instrument: 'Cautery Instruments', status: 'failed', date: new Date(2026, 1, 10) },
    { id: 22, instrument: 'Needle Drivers & Others', status: 'passed', date: new Date(2026, 1, 10) },
    { id: 23, instrument: 'Forceps and Retractors', status: 'passed', date: new Date(2026, 1, 10) },
    { id: 24, instrument: 'Specialty Scissors', status: 'failed', date: new Date(2026, 1, 10) },
    
    // January 2026 data
    { id: 25, instrument: 'Cautery Instruments', status: 'passed', date: new Date(2026, 0, 15) },
    { id: 26, instrument: 'Needle Drivers & Others', status: 'passed', date: new Date(2026, 0, 15) },
    { id: 27, instrument: 'Forceps and Retractors', status: 'failed', date: new Date(2026, 0, 15) },
    { id: 28, instrument: 'Specialty Scissors', status: 'passed', date: new Date(2026, 0, 15) },
    
    { id: 29, instrument: 'Cautery Instruments', status: 'passed', date: new Date(2026, 0, 20) },
    { id: 30, instrument: 'Needle Drivers & Others', status: 'failed', date: new Date(2026, 0, 20) },
    { id: 31, instrument: 'Forceps and Retractors', status: 'passed', date: new Date(2026, 0, 20) },
  ]
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

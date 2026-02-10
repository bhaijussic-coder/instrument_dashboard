import React, {createContext, useReducer, useContext} from 'react'

const INSTRUMENT_CATEGORIES = {
  'Cautery Instruments': [
    'Monopolar_Hook',
    'Monopolar_Spatula',
    'Mini_Cautery_Hook',
    'Mini_Cautery_Spatula',
    'Harmonic_Scalpel',
    'Xpert_Seal',
    'SeliCut Pro'
  ],
  'Forceps and Retractors': [
    'Maryland_Bipolar_Forceps',
    'Fenestrated_Bipolar_Forceps',
    'Black_Diamond_Micro_Forceps',
    'DeBakey_Forceps',
    'Prograsp_Forceps',
    'Tenaculum_Forceps',
    'Grasping_Retractor',
    'Long_Tip_Forceps',
    'Cadiere_Forceps',
    'Atrial_Retractor_Short_Right',
    'Atrial_Retractor_Dual_Blade',
    'Resano_Forceps',
    'Cardiac_Stabilizer',
    'Cardiac_Bipolar_Forceps',
    'Small_Grasping_Retractor',
    'Cobra_Forceps',
    'Cardiac_Probe_Grasper',
    'Tipup_Fenestrated_Retractor',
    'Long_Bipolar_Grasper',
    'Mini_Grasper',
    'Mini_Bipolar_Forceps',
    'Fine_Tissue_Forceps',
    'Maryland Dissector'
  ],
  'Specialty Scissors': [
    'Potts_Scissors',
    'Round_Tip_Scissors',
    'Monopolar_Curved_Scissors',
    'Curved_Cold_Scissors',
    'Mini_Curved_Scissor'
  ],
  'Needle Drivers & Others': [
    'Large_Needle_Driver',
    'Mega_Needle_Driver',
    'Micro_Needle_Driver',
    'Ultra_Needle_Driver',
    'Sevana_Cut_Needle_Driver',
    'Super SeVana(TM) Cut Needle Driver',
    'Small_Titanium_Clip_Applier',
    'Small_Polymer_Clip_Applier',
    'Extra_Titanium_Clip_Applier',
    'Medium_Titanium_Clip_Applier',
    'Medium_Polymer_Clip_Applier',
    'Large_Polymer_Clip_Applier',
    'Multifire_Stapler_60',
    'Multifire_Stapler_45',
    'Knife',
    'Coronary_Connector'
  ]
}

const INSTRUMENT_METADATA = {
  'Monopolar_Hook': { desc: 'Precision cutting & coagulation', category: 'Cautery Instruments' },
  'Maryland_Bipolar_Forceps': { desc: 'Gentle tissue handling with bipolar capability', category: 'Forceps and Retractors' },
  'Fenestrated_Bipolar_Forceps': { desc: 'Fenestrated design for improved depth perception', category: 'Forceps and Retractors' },
  'Potts_Scissors': { desc: 'Angled blades for precise cutting in tight spaces', category: 'Specialty Scissors' },
  'Large_Needle_Driver': { desc: 'Heavy-duty suturing instrument', category: 'Needle Drivers & Others' },
  'Black_Diamond_Micro_Forceps': { desc: 'Diamond-coated for superior grip', category: 'Forceps and Retractors' },
  'Harmonic_Scalpel': { desc: 'Ultrasonic cutting and coagulation device', category: 'Cautery Instruments' },
  'Prograsp_Forceps': { desc: 'Advanced grasping instrument with self-centering design', category: 'Forceps and Retractors' },
  'Cardiac_Stabilizer': { desc: 'Specialized cardiac procedure instrument', category: 'Forceps and Retractors' },
  'Micro_Needle_Driver': { desc: 'Precision micro-suturing instrument', category: 'Needle Drivers & Others' },
  'Small_Titanium_Clip_Applier': { desc: 'Titanium clip application system', category: 'Needle Drivers & Others' }
}

const initialState = {
  instrumentsByCategory: INSTRUMENT_CATEGORIES,
  instrumentMetadata: INSTRUMENT_METADATA,
  instruments: Object.values(INSTRUMENT_CATEGORIES).flat(),
  testResults: [
    // February 2026 data
    { id: 1, instrument: 'Oscilloscope', status: 'passed', date: new Date(2026, 1, 1) },
    { id: 2, instrument: 'Multimeter', status: 'failed', date: new Date(2026, 1, 1) },
    { id: 3, instrument: 'Signal Gen', status: 'passed', date: new Date(2026, 1, 1) },
    { id: 4, instrument: 'Power Supply', status: 'passed', date: new Date(2026, 1, 1) },
    { id: 5, instrument: 'Frequency Counter', status: 'passed', date: new Date(2026, 1, 1) },
    
    { id: 6, instrument: 'Oscilloscope', status: 'failed', date: new Date(2026, 1, 3) },
    { id: 7, instrument: 'Multimeter', status: 'passed', date: new Date(2026, 1, 3) },
    { id: 8, instrument: 'Signal Gen', status: 'passed', date: new Date(2026, 1, 3) },
    { id: 9, instrument: 'Power Supply', status: 'failed', date: new Date(2026, 1, 3) },
    { id: 10, instrument: 'Frequency Counter', status: 'passed', date: new Date(2026, 1, 3) },
    
    { id: 11, instrument: 'Oscilloscope', status: 'passed', date: new Date(2026, 1, 5) },
    { id: 12, instrument: 'Multimeter', status: 'passed', date: new Date(2026, 1, 5) },
    { id: 13, instrument: 'Signal Gen', status: 'failed', date: new Date(2026, 1, 5) },
    { id: 14, instrument: 'Power Supply', status: 'passed', date: new Date(2026, 1, 5) },
    { id: 15, instrument: 'Frequency Counter', status: 'failed', date: new Date(2026, 1, 5) },
    
    { id: 16, instrument: 'Oscilloscope', status: 'passed', date: new Date(2026, 1, 8) },
    { id: 17, instrument: 'Multimeter', status: 'failed', date: new Date(2026, 1, 8) },
    { id: 18, instrument: 'Signal Gen', status: 'passed', date: new Date(2026, 1, 8) },
    { id: 19, instrument: 'Power Supply', status: 'passed', date: new Date(2026, 1, 8) },
    { id: 20, instrument: 'Frequency Counter', status: 'passed', date: new Date(2026, 1, 8) },
    
    { id: 21, instrument: 'Oscilloscope', status: 'failed', date: new Date(2026, 1, 10) },
    { id: 22, instrument: 'Multimeter', status: 'passed', date: new Date(2026, 1, 10) },
    { id: 23, instrument: 'Signal Gen', status: 'passed', date: new Date(2026, 1, 10) },
    { id: 24, instrument: 'Power Supply', status: 'failed', date: new Date(2026, 1, 10) },
    
    // January 2026 data
    { id: 25, instrument: 'Oscilloscope', status: 'passed', date: new Date(2026, 0, 15) },
    { id: 26, instrument: 'Multimeter', status: 'passed', date: new Date(2026, 0, 15) },
    { id: 27, instrument: 'Signal Gen', status: 'failed', date: new Date(2026, 0, 15) },
    { id: 28, instrument: 'Power Supply', status: 'passed', date: new Date(2026, 0, 15) },
    
    { id: 29, instrument: 'Oscilloscope', status: 'passed', date: new Date(2026, 0, 20) },
    { id: 30, instrument: 'Multimeter', status: 'failed', date: new Date(2026, 0, 20) },
    { id: 31, instrument: 'Signal Gen', status: 'passed', date: new Date(2026, 0, 20) },
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

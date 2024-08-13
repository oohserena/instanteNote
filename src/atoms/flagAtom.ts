"use client"
import { atom } from 'recoil';

// atom is a function used to create a piece of state 
// that can be shared across components.
export const refectchCreditsAtom = atom({
    key: 'refetchCredits',
    default: false
})
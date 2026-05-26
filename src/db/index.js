import { get, set } from 'idb-keyval';

const STORE_KEY = 'clickerGameState';

export const saveGameState = async (state) => {
  try {
    await set(STORE_KEY, state);
  } catch (err) {
    console.error('Failed to save game state to IndexedDB', err);
  }
};

export const loadGameState = async () => {
  try {
    const state = await get(STORE_KEY);
    return state;
  } catch (err) {
    console.error('Failed to load game state from IndexedDB', err);
    return null;
  }
};

export const clearGameState = async () => {
  try {
    await set(STORE_KEY, null);
  } catch (err) {
    console.error('Failed to clear game state', err);
  }
};

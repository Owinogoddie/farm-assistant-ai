import {create} from 'zustand';

export const useDialogStore = create((set) => ({
    value: '',
    setValue: (value) => set({ value }),
  }));
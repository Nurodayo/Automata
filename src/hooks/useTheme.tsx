import { create } from "zustand";
// we need to use a global variable since we cant use tailwind inside the stage
type ThemeProp = {
  bool: boolean;
  toggle: () => void;
};

const useTheme = create<ThemeProp>((set) => ({
  bool: true,
  toggle: () => set((state: ThemeProp) => ({ bool: !state.bool })),
}));

export default useTheme;

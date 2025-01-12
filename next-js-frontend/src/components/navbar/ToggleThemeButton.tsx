import { useUpdateTheme } from "@/hooks/useUtils/useUpdateTheme";
import { selectisDarkMode } from "@/services/redux/slices/uiSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { MoonIcon } from "../ui/icons/MoonIcon";
import { SunIcon } from "../ui/icons/SunIcon";

export const ToggleThemeButton = () => {
  const isDarkMode = useAppSelector(selectisDarkMode);
  const { updateTheme } = useUpdateTheme();

  return (
    <button
      onClick={() => updateTheme(isDarkMode ? "light" : "dark")}
      className="flex items-center justify-center cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

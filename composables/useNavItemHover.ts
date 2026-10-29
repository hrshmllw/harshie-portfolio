export function useNavItemHover() {
  const pointerOver = useState("nav-item-pointer-over", () => false);
  const focusWithin = useState("nav-item-focus-within", () => false);
  const isNavItemHovered = computed(
    () => pointerOver.value || focusWithin.value,
  );

  const setNavItemPointer = (over: boolean) => {
    pointerOver.value = over;
  };

  const setNavItemFocus = (within: boolean) => {
    focusWithin.value = within;
  };

  const resetNavItemHovered = () => {
    pointerOver.value = false;
    focusWithin.value = false;
  };

  return {
    isNavItemHovered,
    setNavItemPointer,
    setNavItemFocus,
    resetNavItemHovered,
  };
}

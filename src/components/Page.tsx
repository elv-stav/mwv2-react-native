import { useIsFocused } from '@react-navigation/native';
import { ReactNode, useEffect } from 'react';
import { SpatialNavigationRoot, useLockSpatialNavigation } from 'react-tv-space-navigation';
import { Keyboard } from 'react-native';
import Log from "@/utils/Log";
import { GoBackConfiguration } from "@/components/GoBackConfiguration";

type Props = {
  children: ReactNode,
  /** For debugging purposes, to identify the page in logs */
  name?: string
};

/**
 * Locks/unlocks the navigator when the native keyboard is shown/hidden.
 * Allows for the native focus to take over when the keyboard is open,
 * and to go back to our own system when the keyboard is closed.
 */
const SpatialNavigationKeyboardLocker = () => {
  const lockActions = useLockSpatialNavigation();
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      lockActions.lock();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      lockActions.unlock();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [lockActions]);

  return null;
};

/**
 * Root element of components that are fullscreen pages.
 */
export const Page = ({ children, name }: Props) => {
  const isFocused = useIsFocused();
  // const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();

  // const isActive = isFocused && !isMenuOpen;
  const isActive = isFocused;
  useEffect(() => {
    Log.v(`Page(${name}) isActive: ${isActive}`);
  }, []);

  // const onDirectionHandledWithoutMovement = useCallback(
  //   (movement: Direction) => {
  //     if (movement === 'left') {
  //       toggleMenu(true);
  //     }
  //   },
  //   [toggleMenu],
  // );

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      // onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <GoBackConfiguration />
      <SpatialNavigationKeyboardLocker />
      {isFocused && children}
    </SpatialNavigationRoot>
  );
};

import { useLockOverlay } from './useLockOverlay';
import { SpatialNavigationRoot } from "react-tv-space-navigation";
import { ReactNode } from "react";
import { Modal } from "react-native";

type SpatialNavigationOverlayProps = {
  isModalVisible: boolean;
  hideModal: () => void;
  children: ReactNode;
};

export const SpatialNavigationOverlay = ({
                                           isModalVisible,
                                           hideModal,
                                           children,
                                         }: SpatialNavigationOverlayProps) => {
  useLockOverlay({ isModalVisible, hideModal });

  return <Modal visible={isModalVisible} transparent={true}>
    <SpatialNavigationRoot>{children}</SpatialNavigationRoot>
  </Modal>;
};

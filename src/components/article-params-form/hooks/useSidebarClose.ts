import { useEffect } from 'react';

type UseSidebarCloseProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isSidebarOpen: boolean;
  onClose: () => void;
};

export const useSidebarClose = ({
  containerRef,
  isSidebarOpen,
  onClose,
}: UseSidebarCloseProps): void => {
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleOutsideClick = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, isSidebarOpen, onClose]);
};

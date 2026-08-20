import { CloseSm } from 'icons';
import { Button } from '../Button/Button';
import type { CloseButtonProps } from './CloseButton.types';

// Fixed configuration of Button (110:717, tertiary variant, close-sm
// icon) — no variant/showLabel/icon override surface, see
// CloseButton.types.ts. "Close" is the default accessible name;
// aria-label overrides it for the common case of multiple dismissible
// things on one page (e.g. "Close notification").
function CloseButton({ ref, ...props }: CloseButtonProps) {
  return (
    <Button
      ref={ref}
      variant="tertiary"
      showLabel={false}
      iconStart={<CloseSm />}
      {...props}
    >
      Close
    </Button>
  );
}
CloseButton.displayName = 'CloseButton';

export { CloseButton };

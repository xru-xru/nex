import React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';

import { cn } from '../../lib/utils';
import { PopperPlacement } from '../../types';

type TooltipSize = 'small' | 'medium' | 'large';

type Props = {
  container?: any;
  open?: boolean;
  placement?: PopperPlacement;
  children: any;
  className?: string;
  contentClassName?: string;
  content?: any;
  id?: string;
  variant?: 'light' | 'dark';
  size?: TooltipSize;
  popperProps?: Record<string, any>;
  style?: Record<string, any>;
};

export const classes = {
  root: 'NEXYTooltip',
  open: 'tooltip-active',
};

const getSizeClasses = (size: TooltipSize) => {
  switch (size) {
    case 'small':
      return 'px-3 py-2 text-[11px]';
    case 'medium':
      return 'px-3.5 py-2.5 text-[13px]';
    case 'large':
      return 'px-4 py-4 text-sm';
    default:
      return 'px-4 py-4 text-sm';
  }
};

const getVariantClasses = (variant: 'light' | 'dark') => {
  switch (variant) {
    case 'dark':
      return 'bg-[#2a2b2e] text-white';
    case 'light':
      return 'bg-white text-inherit';
    default:
      return 'bg-white text-inherit';
  }
};

const mapPlacementToSide = (placement: PopperPlacement): 'top' | 'right' | 'bottom' | 'left' => {
  if (placement.startsWith('top')) return 'top';
  if (placement.startsWith('right')) return 'right';
  if (placement.startsWith('bottom')) return 'bottom';
  if (placement.startsWith('left')) return 'left';
  return 'bottom';
};

export function TooltipV2({
  children,
  className,
  contentClassName,
  content,
  open: openProp,
  placement = 'bottom',
  variant = 'light',
  size = 'medium',
  ...rest
}: Props) {
  const [openState, setOpenState] = React.useState(false);
  const { current: isControlled } = React.useRef(openProp != null);

  let open = isControlled ? openProp : openState;

  // We don't need to render tooltip if content is empty string.
  if (content === '') {
    open = false;
  }

  const side = mapPlacementToSide(placement);

  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpenState}>
        <TooltipPrimitive.Trigger asChild>
          {React.cloneElement(children, {
            className: clsx(className, children?.props?.className, {
              [classes.open]: open,
            }),
            ...rest,
          })}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className={cn(
              'z-[3400] break-all rounded leading-[21px] tracking-[0.4px] shadow-[0px_3px_10px_0px_rgba(10,10,10,0.2)]',
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              getSizeClasses(size),
              getVariantClasses(variant),
              classes.root,
              contentClassName,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow
              className={cn(
                'size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
                variant === 'dark' ? 'bg-[#2a2b2e] fill-[#2a2b2e]' : 'bg-white fill-white',
              )}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

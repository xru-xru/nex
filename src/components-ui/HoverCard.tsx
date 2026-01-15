import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '../lib/utils';
import styled from 'styled-components';
import { colorByKey } from '../theme/utils';

export const HoverableTooltip = styled.div`
  background-image: linear-gradient(to right, ${colorByKey('frenchGray')} 40%, rgba(255, 255, 255, 0) 20%);

  background-position: bottom;
  background-size: 5px 1.5px;
  background-repeat: repeat-x;

  cursor: pointer;
`;

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-[20000] w-64 rounded-[6px] border border-[#E5E7EB] bg-white p-4 shadow-[0px_16px_24px_0px_rgba(19,_19,_20,_0.11)] outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      style={{background: 'white', zIndex: 20000, ...props.style}}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };

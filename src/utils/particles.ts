import { RefObject } from 'react';

import styled from 'styled-components';

export const ParticleContainerStyled = styled.div`
  particle {
    position: fixed;
    top: 50px;
    left: 0;
    opacity: 0;
    pointer-events: none;
    background-repeat: no-repeat;
    background-size: contain;
  }
`;

type CornerType =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'middle-top'
  | 'middle-bottom'
  | 'middle-left'
  | 'middle-right'
  | 'center';
interface Props<T> {
  particle: string;
  elementRef: RefObject<T>;
}
const particles = <T extends HTMLElement>({ particle, elementRef }: Props<T>) => {
  const createParticle = (x: number, y: number, innerHtml: string) => {
    if (!elementRef?.current) return;

    const particle = document.createElement('particle');
    elementRef.current.appendChild(particle);

    particle.innerHTML = innerHtml;
    particle.style.fontSize = `${Math.random() * 24 + 10}px`;

    const bbox = elementRef.current.getBoundingClientRect();
    const centerX = bbox.left + bbox.width / 2;
    const centerY = bbox.top + bbox.height / 2;

    const directionX = x >= centerX ? 1 : -1;
    const directionY = y >= centerY ? 1 : -1;

    const destinationX = directionX * (Math.random() * 300);
    const destinationY = directionY * (Math.random() * 300);

    const rotation = Math.random() * 300;

    particle.style.width = 'auto';
    particle.style.height = 'auto';

    const animation = particle.animate(
      [
        {
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${
            y + destinationY
          }px) rotate(${rotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 2000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: 350,
      }
    );

    animation.onfinish = () => {
      particle.remove();
    };
  };

  const createParticlesAtCorner = (corner: CornerType) => {
    if (!elementRef?.current) return;

    const element = elementRef.current;
    const bbox = element.getBoundingClientRect();
    let x, y;

    switch (corner) {
      case 'top-left':
        x = bbox.left;
        y = bbox.top;
        break;
      case 'top-right':
        x = bbox.left + bbox.width;
        y = bbox.top;
        break;
      case 'bottom-left':
        x = bbox.left;
        y = bbox.top + bbox.height;
        break;
      case 'bottom-right':
        x = bbox.left + bbox.width;
        y = bbox.top + bbox.height;
        break;
      case 'middle-top':
        x = bbox.left + bbox.width / 2;
        y = bbox.top;
        break;
      case 'middle-bottom':
        x = bbox.left + bbox.width / 2;
        y = bbox.top + bbox.height;
        break;
      case 'middle-left':
        x = bbox.left;
        y = bbox.top + bbox.height / 2;
        break;
      case 'middle-right':
        x = bbox.left + bbox.width;
        y = bbox.top + bbox.height / 2;
        break;
      case 'center':
        x = bbox.left + bbox.width / 2;
        y = bbox.top + bbox.height / 2;
        break;
    }

    for (let i = 0; i < 8; i++) {
      createParticle(x, y, particle);
    }
  };

  return createParticlesAtCorner;
};

export { particles };

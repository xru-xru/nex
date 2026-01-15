import React from 'react';

import anime from 'animejs';
import clsx from 'clsx';
import styled from 'styled-components';

type Props = {
  animationDisabled?: boolean;
  className?: string;
  infinite?: boolean;
  duration?: number;
  style?: Record<string, any>;
};
export const classes = {
  root: 'NEXYLogo',
  withAnimation: 'anime-prepare',
};
const SvgStyled = styled.svg`
  &.anime-prepare {
    .group-center,
    .logo-name {
      opacity: 0;
    }
    .group-tire-first,
    .group-tire-second {
      fill-opacity: 0;
    }
  }

  .group-center,
  .group-tire-first,
  .group-tire-second {
    fill: #0ec76a;
  }

  .group-center {
    /* opacity: 0; */
  }

  .group-tire-first {
    fill-opacity: 0.4;
  }

  .group-tire-second {
    fill-opacity: 0.2;
  }
`;

function Logo({ infinite = false, animationDisabled = false, duration = 1000, className, ...rest }: Props = {}) {
  const svgRef = React.useRef(null);
  const interval = React.useRef(null);

  const animate = React.useCallback(
    () =>
      anime
        .timeline({
          easing: 'easeOutExpo',
          duration,
          delay: () => anime.random(0, 100),
          complete: () => {
            if (svgRef.current) {
              svgRef.current.classList.remove('anime-prepare');
            }
          },
        })
        .add(
          {
            targets: '.group-center',
            opacity: [0, 1],
          },
          400
        )
        .add(
          {
            targets: '.group-tire-first circle',
            fillOpacity: [0, 0.4],
          },
          500
        )
        .add(
          {
            targets: '.group-tire-second circle',
            fillOpacity: [0, 0.2],
          },
          550
        ),
    [duration]
  );

  React.useEffect(() => {
    if (animationDisabled) {
      return;
    }

    animate();
  }, [animate, animationDisabled]);
  React.useEffect(() => {
    if (!infinite) {
      if (interval.current) {
        clearInterval(interval.current);
      }

      return;
    }

    interval.current = setInterval(() => {
      animate();
    }, duration);
  }, [animate, duration, infinite]);
  React.useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);
  return (
    <SvgStyled
      className={clsx(className, classes.root, {
        [classes.withAnimation]: !animationDisabled,
      })}
      viewBox="0 0 27 30"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...rest}
    >
      <g className="group-center">
        <circle cx="13.386" cy="15.103" r="2.818" />
      </g>
      <g className="group-tire-first">
        <circle cx="13.386" cy="7.705" r="2.114" />
        <circle cx="6.693" cy="10.875" r="2.114" />
        <circle cx="6.693" cy="18.978" r="2.114" />
        <circle cx="20.08" cy="10.875" r="2.114" />
        <circle cx="20.08" cy="18.978" r="2.114" />
        <circle cx="13.386" cy="22.5" r="2.114" />
      </g>
      <g className="group-tire-second">
        <circle cx="25.364" cy="15.103" r="1.409" />
        <circle cx="13.386" cy="1.716" r="1.409" />
        <circle cx="25.364" cy="22.148" r="1.409" />
        <circle cx="1.409" cy="15.103" r="1.409" />
        <circle cx="13.386" cy="28.489" r="1.409" />
        <circle cx="1.409" cy="8.057" r="1.409" />
        <circle cx="7.398" cy="4.887" r="1.409" />
        <circle cx="19.375" cy="4.887" r="1.409" />
        <circle cx="7.398" cy="25.318" r="1.409" />
        <circle cx="19.375" cy="25.318" r="1.409" />
        <circle cx="25.364" cy="8.057" r="1.409" />
        <circle cx="1.409" cy="22.148" r="1.409" />
      </g>
    </SvgStyled>
  );
}

export default Logo;

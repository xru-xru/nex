import React from 'react';

import anime from 'animejs';
import clsx from 'clsx';
import styled from 'styled-components';

import { useTeam } from '../../context/TeamProvider';

import { LaptopLUp } from '../MediaQuery';
import { useSidebar } from '../../context/SidebarProvider';

type Props = {
  animationDisabled?: boolean;
  className?: string;
  hideName?: boolean;
};
export const classes = {
  root: 'NEXYLogo',
  withAnimation: 'anime-prepare',
  nameHidden: 'name-hidden',
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

  .logo-name {
    fill: #1e1f21;

    &.name-hidden {
      display: none;
    }
  }
`;

function Logo({ animationDisabled = false, className, hideName = false }: Props = {}) {
  const { teamId } = useTeam();
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <div className="h-9"></div>;
  }

  // Custom Logos for tenants
  if (teamId === 1105) {
    return (
      <LaptopLUp>
        <img src="https://cdn.nexoya.io/img/webranking.png" alt="webranking.it" style={{ maxWidth: 140 }} />
      </LaptopLUp>
    );
  }
  if (teamId === 1147 || teamId === 1161) {
    return (
      <LaptopLUp>
        <img src="https://cdn.nexoya.io/img/dentsu_black.png" alt="dentsu.com" style={{ maxWidth: 140 }} />
      </LaptopLUp>
    );
  }
  if (teamId === 1146) {
    return (
      <LaptopLUp>
        <img
          src="https://www.nexoya.com/wp-content/uploads/2024/03/Ringier_Advertising.png"
          alt="ringier-advertising logo"
          style={{ maxWidth: 170 }}
        />
      </LaptopLUp>
    );
  }
  if (teamId === 1112 || teamId === 1129 || teamId === 1143 || teamId === 1148) {
    return (
      <LaptopLUp>
        <img src="https://cdn.nexoya.io/img/jakala.svg" alt="jakala.com" style={{ maxWidth: 140 }} />
      </LaptopLUp>
    );
  }
  if (teamId === 1150) {
    return (
      <LaptopLUp>
        <img
          src="https://cdn.nexoya.io/img/logo_mediacom_essence.png"
          alt="essencemediacom.com"
          style={{ maxWidth: 140 }}
        />
      </LaptopLUp>
    );
  }
  if (teamId === 1159) {
    return (
      <LaptopLUp>
        <img src="https://cdn.nexoya.io/img/logo_alkemy.png" alt="Alkemy" style={{ maxWidth: 140 }} />
      </LaptopLUp>
    );
  }
  if (teamId === 1190) {
    return (
      <LaptopLUp>
        <img
          src="https://cdn.nexoya.io/img/dentsu_budget_shaker.png"
          alt="dentsu budget shaker"
          style={{ maxWidth: 140 }}
        />
      </LaptopLUp>
    );
  }
  if (teamId === 1156 || teamId === 1157 || teamId === 1158 || teamId === 1160) {
    return (
      <LaptopLUp>
        <img
          src="https://cdn.nexoya.io/img/logo_publicis_media.png"
          alt="publicisgroupe.com"
          style={{ maxWidth: 140 }}
        />
      </LaptopLUp>
    );
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (teamId === 1211 || teamId === 1213 || hostname.endsWith('gettune.ai')) {
    return (
      <LaptopLUp>
        <img src="https://cdn.nexoya.io/img/logo_ways_sa_tune_large.png" alt="gettune.ai" style={{ maxWidth: 140 }} />
      </LaptopLUp>
    );
  }

  // Default nexoya logo
  const svgRef = React.useRef(null);
  React.useEffect(() => {
    if (animationDisabled) {
      return;
    }

    anime
      .timeline({
        easing: 'easeOutExpo',
        duration: 1000,
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
        400,
      )
      .add(
        {
          targets: '.group-tire-first circle',
          fillOpacity: [0, 0.4],
        },
        500,
      )
      .add(
        {
          targets: '.group-tire-second circle',
          fillOpacity: [0, 0.2],
        },
        550,
      )
      .add(
        {
          targets: '.logo-name',
          opacity: [0, 1],
          translateX: [-5, 0],
        },
        600,
      );
  }, [animationDisabled]);
  return (
    <SvgStyled
      className={clsx(className, classes.root, {
        [classes.withAnimation]: !animationDisabled,
      })}
      viewBox="0 0 105 31"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
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
      <path
        className={clsx('logo-name', {
          [classes.nameHidden]: hideName,
        })}
        d="M35.227 21.125V9.857h1.578v1.893c.811-1.51 2.231-2.119 3.696-2.119 2.457 0 4.237 1.668 4.237 4.44v7.054h-1.577v-6.829c0-1.983-1.15-3.2-2.84-3.2-1.984 0-3.516 1.623-3.516 4.417v5.612h-1.578zm17.3.226c-3.538 0-5.791-2.615-5.791-5.86 0-3.268 2.411-5.86 5.837-5.86 2.93 0 5.296 2.096 5.296 5.702v.428h-9.51c0 2.322 1.712 4.125 4.169 4.125 1.87 0 2.93-.767 3.718-2.119l1.285.834c-.992 1.713-2.66 2.75-5.003 2.75zm-4.034-6.987h7.73c-.292-2.028-1.802-3.268-3.718-3.268-1.87 0-3.65 1.217-4.012 3.268zm18.72 6.761l-3.673-4.53-3.673 4.53H57.86l4.687-5.77-4.214-5.498h1.916l3.268 4.26 3.29-4.26h1.938l-4.237 5.521 4.688 5.747h-1.983zm7.903.226c-3.426 0-5.882-2.637-5.882-5.86 0-3.223 2.456-5.86 5.882-5.86 3.426 0 5.882 2.637 5.882 5.86 0 3.223-2.456 5.86-5.882 5.86zm0-1.465c2.57 0 4.26-1.984 4.26-4.395 0-2.412-1.69-4.395-4.26-4.395-2.592 0-4.26 1.983-4.26 4.395 0 2.411 1.668 4.395 4.26 4.395zm10.426 5.95h-1.78l2.48-5.274-5.004-10.705h1.758l4.124 8.947 4.125-8.947h1.78l-7.483 15.979zM98.81 21.35c-3.178 0-5.612-2.637-5.612-5.86 0-3.223 2.434-5.86 5.612-5.86 1.735 0 3.358.88 4.17 2.119V9.857h1.577v11.268h-1.578v-1.893c-.811 1.24-2.434 2.119-4.17 2.119zm.157-1.465c2.457 0 4.147-1.961 4.147-4.395 0-2.434-1.69-4.395-4.147-4.395-2.456 0-4.146 1.96-4.146 4.395 0 2.434 1.69 4.395 4.146 4.395z"
      />
    </SvgStyled>
  );
}

export default Logo;

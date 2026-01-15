import { track } from '../../constants/datadog';

import ButtonNav from 'components/ButtonNav';
import FeatureSwitch from 'components/FeatureSwitch';
import { LaptopLUp } from 'components/MediaQuery';

import * as Styles from './styles/Sidebar';

import TooltipWrapForSmallScreens from './TooltipWrapForSmallScreens';
import { useUnsavedChanges } from '../../context/UnsavedChangesProvider';
import { useHistory } from 'react-router-dom';

export default function SidebarItem({ item }) {
  const { setHasUnsavedChanges, handleNavigation } = useUnsavedChanges();
  const history = useHistory();

  const onClick = (e) => {
    if (item.event) {
      track(item.event);
    }

    if (!item.external) {
      e.preventDefault();

      handleNavigation(() => {
        setHasUnsavedChanges(false);
        history.push(item.link);
      });
    }
  };

  const renderedItem = () => (
    <TooltipWrapForSmallScreens content={item.name} variant="dark" placement="right">
      <Styles.NavWrapStyled>
        {item.external ? (
          <a
            className="flex justify-between rounded-md px-4 py-2.5 font-light text-neutral-700 transition-all hover:bg-[#f2f2f4]"
            data-cy={item.cy}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            onClick={onClick}
          >
            <div className="h-2 w-2">{item.icon}</div>
            <LaptopLUp>{item.name}</LaptopLUp>
            {item.meta && (
              <LaptopLUp>
                <Styles.NewStyled>{item.meta}</Styles.NewStyled>
              </LaptopLUp>
            )}
          </a>
        ) : (
          <ButtonNav data-cy={item.cy} to={item.link} exact={item.exact} isActive={item.isActive} onClick={onClick}>
            {item.icon}
            <LaptopLUp>{item.name}</LaptopLUp>
            {item.meta && (
              <LaptopLUp>
                <Styles.NewStyled>{item.meta}</Styles.NewStyled>
              </LaptopLUp>
            )}
          </ButtonNav>
        )}
      </Styles.NavWrapStyled>
    </TooltipWrapForSmallScreens>
  );

  return item.feature ? (
    <FeatureSwitch features={[item.feature]} renderOld={() => null} renderNew={renderedItem} />
  ) : (
    renderedItem()
  );
}

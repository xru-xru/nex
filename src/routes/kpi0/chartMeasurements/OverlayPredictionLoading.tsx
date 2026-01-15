import React, { PureComponent } from 'react';
import { Transition } from 'react-transition-group';

import Spinner from '../../../components/Spinner';
import Text from '../../../components/Text';

import { InnerWrapStyled, OverlayWrapStyled } from './styles';

type Props = {
  isOpen: boolean;
};
type State = {
  title: string;
};

class OverlayPredictionLoading extends PureComponent<Props, State> {
  state = {
    title: 'Please wait',
  };
  timer = null;

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        title: 'Still processing...',
      });
      this.timer = setTimeout(() => {
        this.setState({
          title: 'Can take up to 30 seconds...',
        });
      }, 6000);
    }, 3500);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    const { title } = this.state;
    const { isOpen } = this.props;
    if (!isOpen) return null;
    return (
      <Transition in={this.props.isOpen} timeout={300} unmountOnExit mountOnEnter>
        {(state) => (
          <OverlayWrapStyled
            transitionState={state}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <InnerWrapStyled transitionState={state}>
              <div
                style={{
                  marginBottom: 15,
                }}
              >
                <Spinner />
              </div>
              <Text component="h3" id="alert-dialog-title" withEllipsis={false}>
                {title}
              </Text>
              <Text component="p" id="alert-dialog-description" withEllipsis={false}>
                We are predicting the next days with our AI Model.
                <br />
                This is based on the available existing data of your KPI.
              </Text>
            </InnerWrapStyled>
          </OverlayWrapStyled>
        )}
      </Transition>
    );
  }
}

export default OverlayPredictionLoading;

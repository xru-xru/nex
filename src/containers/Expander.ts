import { ReactNode } from 'react';
import { PureComponent } from 'react';

type RenderProps = {
  expanded: boolean;
  toggleExpander: () => void;
};
type Props = {
  children: (renderProps: RenderProps) => ReactNode;
};
type State = {
  expanded: boolean;
};

class Expander extends PureComponent<Props, State> {
  state = {
    expanded: false,
  };
  toggleExpander = () =>
    this.setState((state) => ({
      expanded: !state.expanded,
    }));

  render() {
    const { expanded } = this.state;
    return this.props.children({
      expanded,
      toggleExpander: this.toggleExpander,
    });
  }
}

export default Expander;

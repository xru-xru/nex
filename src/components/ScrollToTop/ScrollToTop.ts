import { PureComponent } from 'react';
import { Location } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends PureComponent<
  {
    children: any;
    location: Location;
  },
  void
> {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);

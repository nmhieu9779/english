import React from 'react';
import { render } from '@testing-library/react';

import { LeftMenu } from '..';

describe('<LeftMenu  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<LeftMenu />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});

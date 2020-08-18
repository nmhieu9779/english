import React from 'react';
import { render } from '@testing-library/react';

import { Upload } from '..';

describe('<Upload  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Upload />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});

export default {
  getCurrentBreakpoint: ({ window: { innerWidth = 0 } }) => {
    let currentBreakPoint = '';
    if (innerWidth < 576) {
      currentBreakPoint = 'xs';
    }
    if (innerWidth >= 576 && innerWidth < 768) {
      currentBreakPoint = 'sm';
    }
    if (innerWidth >= 768 && innerWidth < 992) {
      currentBreakPoint = 'md';
    }
    if (innerWidth >= 992 && innerWidth < 1200) {
      currentBreakPoint = 'lg';
    }
    if (innerWidth >= 1200 && innerWidth < 1600) {
      currentBreakPoint = 'xl';
    }
    if (innerWidth >= 1600) {
      currentBreakPoint = 'xxl';
    }
    return currentBreakPoint;
  },
};

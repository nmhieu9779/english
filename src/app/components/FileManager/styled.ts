import styled from 'styled-components/macro';
import { Timeline } from 'antd';

const validateBreakpoint = currentBreakpoint =>
  ['xs', 'sm', 'md'].includes(currentBreakpoint);

const Div = styled.div<{ currentBreakpoint: string }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ currentBreakpoint }) =>
      validateBreakpoint(currentBreakpoint) ? 1 : 2},
    1fr
  );
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: ${({ currentBreakpoint }) =>
    validateBreakpoint(currentBreakpoint) ? '10px' : '30px'};
  height: 100%;
  padding: 20px;
  overflow-y: scroll;
`;

const FileManagerWrapper = styled.div<{
  currentBreakpoint: string;
  autoUpload: boolean;
}>`
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  flex-direction: ${({ currentBreakpoint }) =>
    currentBreakpoint === 'xs' ? 'column' : 'row'};
  max-height: ${({ currentBreakpoint }) =>
    currentBreakpoint === 'xs' ? 'auto' : '45vh'};
  border: ${({ currentBreakpoint }) =>
    validateBreakpoint(currentBreakpoint) ? '0' : '0.5px solid #e4e0e0'};
  border-radius: 5px;
  .upload-wrapper__container {
    flex: 1;
    padding: ${({ currentBreakpoint }) =>
      currentBreakpoint === 'xs' ? '0px' : '20px'};
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: ${({ autoUpload }) =>
      autoUpload ? 'flex-start' : 'space-between'};
    align-items: flex-end;
    .upload-wrapper__option {
      width: 100%;
      .header {
        font-weight: bold;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        .tooltip {
          margin-left: 5px;
        }
      }
      .input {
        margin-bottom: 10px;
      }
      .tooltip__icon {
        color: 'rgba(0,0,0,.45)';
      }
    }
    .upload-wrapper__drop-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      width: 100%;
      height: 200px;
      border: 1px dashed #001529;
      user-select: none;
      .drop-message {
        text-align: center;
        color: #001529;
        font-family: Arial;
        font-size: 18px;
      }
      .file-input {
        display: none;
      }
    }
    .button-upload {
      margin-top: ${({ currentBreakpoint }) =>
        currentBreakpoint === 'xs' ? '10px' : '0'};
    }
  }
  .upload-wrapper__container__list {
    align-items: initial;
    margin-top: 20px;
    justify-content: flex-start;
  }
`;

const TimeLineContainer = styled.div<{ currentbreakpoint: string }>`
  grid-area: ${({ currentbreakpoint }) =>
    validateBreakpoint(currentbreakpoint) ? '2 / 1 / 3 / 2' : ' 1 / 2 / 2 / 3'};
  border: ${({ currentbreakpoint }) =>
    validateBreakpoint(currentbreakpoint) ? '0' : '0.5px solid #e4e0e0'};
  border-radius: 5px;
  height: ${({ currentbreakpoint }) =>
    validateBreakpoint(currentbreakpoint) ? '200px' : 'auto'};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: center;
  .anticon {
    position: absolute;
    font-size: ${({ currentbreakpoint }) =>
      validateBreakpoint(currentbreakpoint) ? '10px' : '20px'};
    padding: ${({ currentbreakpoint }) =>
      validateBreakpoint(currentbreakpoint) ? '5px' : '10px'};
  }
  .anticon-right {
    right: ${({ currentbreakpoint }) =>
      validateBreakpoint(currentbreakpoint) ? '5px' : '10px'};
  }
  .anticon-left {
    left: ${({ currentbreakpoint }) =>
      validateBreakpoint(currentbreakpoint) ? '5px' : '10px'};
  }
`;

const StyledTimeline = styled(Timeline)<{ currentbreakpoint: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: auto;
  right: auto;
  width: ${({ currentbreakpoint }) =>
    validateBreakpoint(currentbreakpoint)
      ? 'calc(100% - 50px)'
      : 'calc(100% - 100px)'};
  height: 100%;
  overflow: scroll;
  .ant-timeline-item-label {
    top: 0px !important;
  }
  .ant-timeline-item-head {
    top: 5px;
  }
  .ant-timeline-item-content {
    top: 0px;
  }
`;

const StyledFileManager = styled.div<{ currentBreakpoint: string }>`
  grid-area: ${({ currentBreakpoint }) =>
    validateBreakpoint(currentBreakpoint) ? '3 / 1 / 4 / 2' : '2 / 1 / 3 / 3'};
  .ant-table-container {
    .ant-table-content {
      .ant-table-tbody {
        .ant-table-cell {
          .table__icon {
            margin: 0px 5px;
            vertical-align: text-top;
          }
          .table__content {
            width: max-content;
            cursor: pointer;
          }
          .table__actions {
            display: flex;
            .anticon {
              font-size: 15px;
              padding: 5px;
            }
          }
        }
      }
    }
  }
  .ant-breadcrumb {
    padding: 10px;
    span {
      cursor: pointer;
    }
  }
`;

const StyledUploadItem = styled.div<{ status: string }>`
  border: 0.5px solid
    ${({ status }) => {
      if (status === 'success') return 'green';
      if (status === 'failure') return 'red';
      return 'white';
    }};
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 3px;
  display: flex;
  .uploads__icon {
    font-size: 48px;
    margin-right: 10px;
  }
`;

export default {
  Div,
  FileManagerWrapper,
  TimeLineContainer,
  StyledTimeline,
  StyledFileManager,
  StyledUploadItem,
};

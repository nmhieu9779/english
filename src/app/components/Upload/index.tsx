/**
 *
 * Upload
 *
 */
import React, { memo, useRef, useState, useMemo } from 'react';
import styled from 'styled-components/macro';
import { Table, Typography, List, message } from 'antd';
import { Select } from 'antd';
import { uploadService } from '../../../services';
import {
  FileImageOutlined,
  AudioOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';

const { Option } = Select;

interface Props {
  currentBreakpoint: string;
}

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export const Upload = memo(({ currentBreakpoint }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads]: [
    { name: string; fileType: string; status: string } | [],
    any,
  ] = useState([]);

  const preventDefault = e => {
    e.preventDefault();
  };

  const dragOver = e => {
    preventDefault(e);
  };

  const dragEnter = e => {
    preventDefault(e);
  };

  const dragLeave = e => {
    preventDefault(e);
  };

  const fileDrop = e => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleSelectedFile(files);
    }
  };

  const fileInputClicked = () => {
    fileInputRef.current?.click();
  };

  const filesSelected = () => {
    if (fileInputRef.current?.files?.length) {
      handleSelectedFile(fileInputRef.current?.files);
    }
  };

  const handleSelectedFile = files => {
    const handleUploadEnd = ({ status, name }) => {
      message[status](`Upload ${name} ${status}`);
      setUploads(prevUploads => {
        const index = prevUploads.findIndex(item => item.name === name);
        prevUploads[index]['status'] = status;
        return [...prevUploads];
      });
    };
    const [file] = files;
    const { name, type: fileType } = file;
    setUploads(prevUploads => [
      ...prevUploads,
      { name, fileType, status: 'uploading' },
    ]);
    const data = new FormData();
    data.append('image', file);
    uploadService
      .upload(data)
      .then(() => handleUploadEnd({ status: 'success', name }))
      .catch(() => handleUploadEnd({ status: 'failure', name }));
  };

  const Uploads = useMemo(
    () =>
      uploads.map(({ name, fileType, status }, idx) => (
        <StyledUploadItem status={status} key={idx}>
          {status === 'uploading' ? (
            <Spin
              indicator={<LoadingOutlined className={'uploads__icon'} spin />}
            />
          ) : fileType === 'audio/mpeg' ? (
            <AudioOutlined className={'uploads__icon'} />
          ) : (
            <FileImageOutlined className={'uploads__icon'} />
          )}
          <span>{name}</span>
        </StyledUploadItem>
      )),
    [uploads],
  );

  return (
    <Div currentBreakpoint={currentBreakpoint}>
      <UploadWrapper currentBreakpoint={currentBreakpoint}>
        <div className="upload-wrapper__container">
          <div className="upload-wrapper__option">
            <span className="header">Upload Option</span>
            <div className="option-wrapper">
              <span>Day: </span>
              <Select>
                <Option value="jack">Jack</Option>
              </Select>
            </div>
            <div className="option-wrapper">
              <span>Type: </span>
              <Select>
                <Option value="jack">Jack</Option>
              </Select>
            </div>
          </div>
          <div
            className="upload-wrapper__drop-container"
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
            onClick={fileInputClicked}
          >
            <div className="drop-message">
              {'Drag & Drop files here or click to select file(s)'}
            </div>
            <input
              ref={fileInputRef}
              className="file-input"
              type="file"
              multiple
              onChange={filesSelected}
            />
          </div>
        </div>
        <div className="upload-wrapper__container">{Uploads}</div>
      </UploadWrapper>
      <StyledList
        currentbreakpoint={currentBreakpoint}
        header={<div>Upload Log</div>}
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>[ITEM]</Typography.Text> {item}
          </List.Item>
        )}
      />
      <StyledTable
        currentBreakpoint={currentBreakpoint}
        dataSource={dataSource}
        columns={columns}
      />
    </Div>
  );
});

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
  grid-row-gap: 30px;
  height: 100%;
  padding: 20px;
`;

const UploadWrapper = styled.div<{ currentBreakpoint: string }>`
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  max-height: ${({ currentBreakpoint }) =>
    currentBreakpoint === 'xs' ? 'auto' : '45vh'};
  .upload-wrapper__container {
    flex: 1;
    padding: 20px;
    overflow-y: scroll;
    .upload-wrapper__option {
      .header {
        font-weight: bold;
        margin-bottom: 20px;
      }
      .option-wrapper {
        margin-bottom: 20px;
        .ant-select {
          width: 100%;
        }
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
  }
`;

const StyledList = styled(List)<{ currentbreakpoint: string }>`
  grid-area: ${({ currentbreakpoint }) =>
    validateBreakpoint(currentbreakpoint) ? '2 / 1 / 3 / 2' : ' 1 / 2 / 2 / 3'};
`;

const StyledTable = styled(Table)<{ currentBreakpoint: string }>`
  grid-area: ${({ currentBreakpoint }) =>
    validateBreakpoint(currentBreakpoint) ? '3 / 1 / 4 / 2' : '2 / 1 / 3 / 3'};
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

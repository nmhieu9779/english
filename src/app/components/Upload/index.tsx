/**
 *
 * Upload
 *
 */
import React, {
  memo,
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import styled from 'styled-components/macro';
import {
  Table,
  Typography,
  List,
  message,
  Input,
  Spin,
  Tooltip,
  Switch,
  Button,
} from 'antd';
import { uploadService } from '../../../services';
import {
  FileImageOutlined,
  AudioOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

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
  const [path, setPath] = useState('');
  const [note, setNote] = useState('');
  const [clearInput, setClearInput] = useState(true);
  const [autoUpload, setAutoUpload] = useState(true);
  const [file, setFile]: [any, any] = useState(undefined);
  const [fileInput, setFileInput]: [string, any] = useState('');

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
      setFile(files[0]);
    }
  };

  const fileInputClicked = () => {
    fileInputRef.current?.click();
  };

  const filesSelected = () => {
    setFileInput(fileInputRef.current?.value);
    if (fileInputRef.current?.files?.length) {
      setFile(fileInputRef.current?.files[0]);
    }
  };

  const handleUploadEnd = useCallback(
    ({ status, name }) => {
      message[status](`Upload ${name} ${status}`);
      setUploads(prevUploads => {
        const index = prevUploads.findIndex(item => item.name === name);
        prevUploads[index]['status'] = status;
        return [...prevUploads];
      });
      setFile(undefined);
      if (clearInput) {
        setPath('');
        setNote('');
      }
    },
    [clearInput],
  );

  const uploadFile = useCallback(
    file => {
      if (!file) return;
      const { name, type: fileType } = file;
      setUploads(prevUploads => [
        ...prevUploads,
        { name, fileType, status: 'uploading' },
      ]);
      const data = new FormData();
      data.append('image', file);
      data.append('path', path);
      data.append('note', note);
      uploadService
        .upload(data)
        .then(() => handleUploadEnd({ status: 'success', name }))
        .catch(() => handleUploadEnd({ status: 'failure', name }));
    },
    [handleUploadEnd, path, note],
  );

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

  const onChangePath = useCallback(({ target: { value } }) => {
    setPath(value);
  }, []);

  const onChangeNote = useCallback(({ target: { value } }) => {
    setNote(value);
  }, []);

  const onChangeClearInput = useCallback(checked => {
    setClearInput(checked);
  }, []);

  const onChangeAutoUpload = useCallback(checked => {
    setFileInput('');
    setFile(undefined);
    setAutoUpload(checked);
  }, []);

  useEffect(() => {
    if (autoUpload) {
      uploadFile(file);
    }
  }, [autoUpload, uploadFile, file]);

  const onClickUpload = useCallback(() => {
    uploadFile(file);
  }, [uploadFile, file]);

  return (
    <Div currentBreakpoint={currentBreakpoint}>
      <UploadWrapper
        autoUpload={autoUpload}
        currentBreakpoint={currentBreakpoint}
      >
        <div className="upload-wrapper__container">
          <div className="upload-wrapper__option">
            <div className="header">
              Upload Option
              <div>
                <Switch checked={autoUpload} onChange={onChangeAutoUpload} />
                <Tooltip className="tooltip" title="Auto upload">
                  <InfoCircleOutlined className="tooltip__icon" />
                </Tooltip>
              </div>
              <div>
                <Switch checked={clearInput} onChange={onChangeClearInput} />
                <Tooltip
                  className="tooltip"
                  title="Clear input when uploading successfully"
                >
                  <InfoCircleOutlined className="tooltip__icon" />
                </Tooltip>
              </div>
            </div>
            <div className="input">
              <Input
                addonBefore="~/"
                placeholder="Path"
                suffix={
                  <Tooltip title="Path to save the file">
                    <InfoCircleOutlined className="tooltip__icon" />
                  </Tooltip>
                }
                value={path}
                onChange={onChangePath}
              />
            </div>
            <TextArea
              className="input"
              placeholder="Note"
              autoSize={{ minRows: 3, maxRows: 4 }}
              value={note}
              onChange={onChangeNote}
            />
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
              value={fileInput}
            />
          </div>
          {autoUpload ? null : (
            <Button
              type="primary"
              shape="round"
              className="button-upload"
              icon={<CloudUploadOutlined />}
              onClick={onClickUpload}
              disabled={!file}
            >
              Upload
            </Button>
          )}
        </div>
        <div className="upload-wrapper__container upload-wrapper__container__list">
          {Uploads}
        </div>
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

const UploadWrapper = styled.div<{
  currentBreakpoint: string;
  autoUpload: boolean;
}>`
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  flex-direction: ${({ currentBreakpoint }) =>
    currentBreakpoint === 'xs' ? 'column' : 'row'};
  max-height: ${({ currentBreakpoint }) =>
    currentBreakpoint === 'xs' ? 'auto' : '45vh'};
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

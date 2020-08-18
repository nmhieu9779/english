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
import {
  Table,
  message,
  Input,
  Spin,
  Tooltip,
  Switch,
  Button,
  Timeline,
  Breadcrumb,
  Popconfirm,
} from 'antd';
import { uploadService } from '../../../services';
import {
  FileImageOutlined,
  AudioOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
  FileOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteTwoTone,
  InfoCircleTwoTone,
  EditTwoTone,
} from '@ant-design/icons';
import moment from 'moment';
import Styled from './styled';

const {
  Div,
  FileManagerWrapper,
  TimeLineContainer,
  StyledTimeline,
  StyledFileManager,
  StyledUploadItem,
} = Styled;

const { TextArea } = Input;

interface Props {
  currentBreakpoint: string;
}

export const FileManager = memo(({ currentBreakpoint }: Props) => {
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
  const [fileManager, setFileManager]: [
    { files: []; folders: []; loading: boolean },
    any,
  ] = useState({
    files: [],
    folders: [],
    loading: false,
  });
  const [directory, setDirectory] = useState('');
  const [logs, setLogs] = useState({
    data: [],
    totalPage: 1,
  });
  const [logsConfig, setLogsConfig] = useState({
    page: 0,
    pageSize: 10,
  });

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

  const getFiles = useCallback(() => {
    setFileManager({ ...fileManager, loading: true });
    uploadService
      .getFiles({ directory })
      .then(({ data: { files = [], folders = [] } }) => {
        setFileManager({ files, folders, loading: false });
      })
      .catch(e => setFileManager({ ...fileManager, loading: false }));
  }, [directory, fileManager]);

  const dataFileManager = useMemo(() => {
    if (!fileManager.loading) {
      const { files, folders } = fileManager;
      let count = 0;
      return [
        ...folders.map(folder => {
          count++;
          return {
            key: count,
            title: folder,
            fileSize: '-',
            lastModified: '',
            icon: FolderOpenOutlined,
            type: 'folder',
            path: '',
          };
        }),
        ...files.map(({ name, size, path, lastModified }) => {
          count++;
          return {
            key: count,
            title: name,
            fileSize: size,
            lastModified: moment(lastModified).format('DD/MM/YYYY HH:mm:ss'),
            icon: FileOutlined,
            type: 'file',
            path,
          };
        }),
      ];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileManager.loading]);

  const getLogs = useCallback(() => {
    const { page, pageSize } = logsConfig;
    uploadService
      .getLogs({
        page,
        pageSize,
      })
      .then(({ data: { data, totalPage } }) => {
        setLogs({ data, totalPage });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logsConfig.page, logsConfig.pageSize]);

  const handleUploadEnd = useCallback(
    ({ status, name }) => {
      message[status](`Upload ${name} ${status}`);
      setUploads(prevUploads => {
        const index = prevUploads.findIndex(item => item.name === name);
        prevUploads[index]['status'] = status;
        return [...prevUploads];
      });
      setFile(undefined);
      setFileInput('');
      if (clearInput) {
        setPath('');
        setNote('');
      }
      getFiles();
      getLogs();
    },
    [clearInput, getFiles, getLogs],
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

  const breadcrumb = useMemo(() => {
    const breadcrumb = `/${directory}`.split('/');
    return breadcrumb.map((e, idx) => (
      <Breadcrumb.Item
        key={idx}
        onClick={() => {
          let newDirectory = '';
          if (breadcrumb.length > 0) {
            const index = breadcrumb.findIndex(value => value === e);
            let i = 1;
            while (i <= index) {
              newDirectory += `${i === 1 ? '' : '/'}${breadcrumb[i]}`;
              i++;
            }
          }
          setDirectory(newDirectory);
        }}
      >
        {idx === 0 ? 'root' : e}
      </Breadcrumb.Item>
    ));
  }, [directory]);

  const onClickDownload = ({ title = '', type = '', path = '' }) => () => {
    if (type === 'folder') {
      setDirectory(`${directory ? `${directory}/` : ''}${title}`);
    } else {
      uploadService.downloadFile({ path });
    }
  };

  const onClickDelete = ({ type = '', path = '', title: fileName }) => () => {
    if (type === 'folder') {
      console.log('object');
    } else {
      setFileManager(prevFileManager => ({
        ...prevFileManager,
        loading: true,
      }));
      uploadService.deleteFile({ path, fileName }).then(() => {
        getFiles();
        getLogs();
      });
    }
  };

  useEffect(() => {
    getFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directory]);

  useEffect(() => {
    getLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logsConfig.page]);

  const timeLineItem = useMemo(
    () =>
      logs.data.map(({ createdAt, message }, idx) => (
        <Timeline.Item
          key={idx}
          label={moment(createdAt).format('DD/MM/YYYY HH:mm:ss')}
        >
          {message}
        </Timeline.Item>
      )),
    [logs.data],
  );

  const onLogChange = useCallback(
    ({ currentTarget: { title } }) => {
      if (title === 'Prev' && logsConfig.page > 0) {
        setLogsConfig(prevLogsConfig => ({
          ...prevLogsConfig,
          page: prevLogsConfig.page - 1,
        }));
      }
      if (title === 'Next' && +logsConfig.page + 1 < logs.totalPage) {
        setLogsConfig(prevLogsConfig => ({
          ...prevLogsConfig,
          page: prevLogsConfig.page + 1,
        }));
      }
    },
    [logs.totalPage, logsConfig.page],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        fixed: true,
        render: (value, { icon: Icon, title, type, path }: any) => {
          return (
            <div
              onClick={onClickDownload({ title, type, path })}
              className={'table__content'}
            >
              <Icon className={'table__icon'} />
              {value}
            </div>
          );
        },
      },
      {
        title: 'File size (Byte)',
        dataIndex: 'fileSize',
        key: 'fileSize',
      },
      {
        title: 'Last modified',
        dataIndex: 'lastModified',
        key: 'lastModified',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (value, { title, type, path }: any) => {
          return (
            <div className={'table__actions'}>
              <InfoCircleTwoTone twoToneColor={'gray'} />
              <EditTwoTone twoToneColor={'blue'} />
              <Popconfirm
                title={`Are you sure delete ${title}?`}
                onConfirm={onClickDelete({ type, path, title })}
                okText="Yes"
                cancelText="No"
              >
                <DeleteTwoTone twoToneColor={'red'} />
              </Popconfirm>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <Div currentBreakpoint={currentBreakpoint}>
      <FileManagerWrapper
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
      </FileManagerWrapper>
      <TimeLineContainer currentbreakpoint={currentBreakpoint}>
        <LeftOutlined title={'Prev'} onClick={onLogChange} />
        <StyledTimeline currentbreakpoint={currentBreakpoint} mode={'left'}>
          {timeLineItem}
        </StyledTimeline>
        <RightOutlined title={'Next'} onClick={onLogChange} />
      </TimeLineContainer>
      <StyledFileManager currentBreakpoint={currentBreakpoint}>
        <Breadcrumb separator=">">{breadcrumb}</Breadcrumb>
        <Table
          dataSource={dataFileManager}
          columns={columns}
          pagination={false}
          bordered={true}
          size={'small'}
          loading={fileManager.loading}
        />
      </StyledFileManager>
    </Div>
  );
});

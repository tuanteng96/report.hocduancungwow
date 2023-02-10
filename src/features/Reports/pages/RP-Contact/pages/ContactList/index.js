import React, { useEffect, useMemo, useRef, useState } from 'react'
import IconMenuMobile from 'src/features/Reports/components/IconMenuMobile'
import _ from 'lodash'
import ReactTableV7 from 'src/components/Tables/ReactTableV7'
import reportsApi from 'src/api/reports.api'
import { uuidv4 } from '@nikitababko/id-generator'
import clsx from 'clsx'
import Select from 'react-select'

import moment from 'moment'
import 'moment/locale/vi'
import { PermissionHelpers } from 'src/helpers/PermissionHelpers'

moment.locale('vi')

const StatusList = [
  {
    label: 'Chưa xem',
    value: 'CHUA_XEM'
  },
  {
    label: 'Đã xem',
    value: 'DA_XEM'
  },
  {
    label: 'Xóa',
    value: 'XOA'
  }
]

const getStatus = status => {
  if (!status || status === 'CHUA_XEM') {
    return <span className="text-uppercase fw-600 font-size-sm">Chưa xem</span>
  }
  if (status === 'XOA') {
    return <span className="fw-500 text-danger">Đã xóa</span>
  }
  return <span className="fw-500 text-success">Đã xem</span>
}

const DetailRenderer = ({ filters, rowData, ...props }) => {
  const { content } = rowData
  return (
    <div className="w-100">
      <div className="row m-0">
        <div className="col-md-3 p-0 border-right">
          <div className="h-100">
            <div className="border-bottom px-20px py-10px">
              ID : <span className="fw-600">{content.ID}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Ngày tạo :
              <span className="fw-600 pl-3px">
                {moment(content.Ngay_gui).format('HH:mm DD/MM/YYYY')}
              </span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Trạng thái :
              <span className="fw-600 pl-3px">
                {getStatus(content.TrangThai)}
              </span>
            </div>
            <div className="px-20px py-10px">
              Tên trường :
              <span className="fw-600 pl-3px">{content.Ten_Truong}</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 p-0 border-right">
          <div className="h-100">
            <div className="border-bottom px-20px py-10px">
              Quận huyện :
              <span className="fw-600 pl-3px">{content.Quan_Huyen}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Đại diện ban giám hiệu :
              <span className="fw-600 pl-3px">{content.Dai_dien}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Số điện thoại liên hệ :
              <span className="fw-600 pl-3px">{content.SDT_Lienhe}</span>
            </div>
            <div className="px-20px py-10px">
              Danh sách đăng ký :
              <a
                className="pl-3px"
                href={`/upload/image/${content.Src}`}
                target="_blank"
                rel="noreferrer"
              >
                Tải danh sách
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3 p-0 border-right">
          <div className="h-100">
            <div className="border-bottom px-20px py-10px">
              Họ tên giáo viên :
              <span className="fw-600 pl-3px">{content.Giao_vien}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Số điện thoại :
              <span className="fw-600 pl-3px">{content.SDT_Giao_vien}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Email liên hệ :
              <span className="fw-600 pl-3px">{content.Email}</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 p-0">
          <div className="h-100">
            <div className="border-bottom px-20px py-10px">
              Lớp :<span className="fw-600 pl-3px">{content.Ten_lop}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Tên nhóm :
              <span className="fw-600 pl-3px">{content.Ten_nhom}</span>
            </div>
            <div className="border-bottom px-20px py-10px">
              Sản phẩm : <span className="fw-600 pl-3px">{content.Ten_sp}</span>
              <a
                className="pl-3px"
                href={`/upload/image/${content.SanPham}`}
                target="_blank"
                rel="noreferrer"
              >
                (Tải sản phẩm )
              </a>
            </div>
            <div className="px-20px py-10px">
              Kịch bản :
              <span className="pl-3px fw-600">
                {content.KichBan ? (
                  <a
                    className="pl-3px"
                    href={`/upload/image/${content.KichBan}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tải kịch bản
                  </a>
                ) : (
                  'Chưa có'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactList(props) {
  const [ListData, setListData] = useState([])
  const [Selected, setSelected] = useState([])
  const [PageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState('')
  const [isFilter, setIsFilter] = useState(false)
  const [filters, setFilters] = useState({
    Pi: 1,
    Ps: 15,
    filter: {
      Ten_Truong: ''
    }
  })
  const [loadingExport, setLoadingExport] = useState(false)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    getListContact()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListContact = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListContact(filters)
      .then(({ data }) => {
        const { Items, PCounts } = {
          Items:
            data?.items?.map((item, index) => ({
              ...item,
              Ids: uuidv4(),
              children: [
                {
                  ...item,
                  Ids: uuidv4(),
                  ID: `${index}-detail`,
                  content: {
                    ...item
                  }
                }
              ]
            })) || [],
          Total: data?.total || 0,
          PCounts: data?.pcount || 0
        }
        setListData(Items)
        setLoading(false)
        setPageCount(PCounts)
        isFilter && setIsFilter(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  const onPagesChange = ({ Pi, Ps }) => {
    setFilters({ ...filters, Pi, Ps })
  }

  const onExport = () => {
    PermissionHelpers.ExportExcel({
      FuncStart: () => setLoadingExport(true),
      FuncEnd: () => setLoadingExport(false),
      FuncApi: () => reportsApi.getListContact({ ...filters, Ps: 5000 }),
      UrlName: '/list-contact'
    })
  }

  const onChangeAll = evt => {
    if (evt.target.checked) {
      setSelected(ListData.map(x => x.ID))
    } else {
      setSelected([])
    }
  }

  const onChangeSelected = evt => {
    if (evt.target.checked) {
      setSelected(prevState => [...prevState, Number(evt.target.value)])
    } else {
      setSelected(prevState =>
        prevState.filter(x => x !== Number(evt.target.value))
      )
    }
  }

  const onChangeStatus = type => {
    setLoadingUpdate(type)
    const obj = {
      update: {
        ids: Selected,
        status: type
      }
    }
    reportsApi
      .updateStatus(obj)
      .then(({ data }) => {
        getListContact(false, () => {
          setSelected([])
          setLoadingUpdate(false)
          window.top.toastr &&
            window.top.toastr.success('Cập nhập thành công', { timeOut: 1000 })
        })
      })
      .catch(error => console(error))
  }

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowData }) => (
          <label className="checkbox d-flex">
            <input
              type="checkbox"
              checked={Selected.includes(rowData.ID)}
              onChange={onChangeSelected}
              value={rowData.ID}
            />
            <span className="checkbox-icon"></span>
          </label>
        ),
        width: 60,
        sortable: false,
        align: 'center',
        mobileOptions: {
          visible: true
        },
        headerRenderer: () => (
          <label className="checkbox d-flex">
            <input
              onChange={onChangeAll}
              type="checkbox"
              checked={
                Selected &&
                Selected.length > 0 &&
                _.isEqual(Selected.sort(), ListData.map(x => x.ID).sort())
              }
            />
            <span className="checkbox-icon"></span>
          </label>
        )
      },
      {
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        width: 80,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'Ngay_gui',
        title: 'Ngày tạo',
        dataKey: 'Ngay_gui',
        cellRenderer: ({ rowData }) =>
          moment(rowData.Ngay_gui).format('HH:mm DD/MM/YYYY'),
        width: 160,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'TrangThai',
        title: 'Trạng thái',
        dataKey: 'TrangThai',
        width: 180,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        cellRenderer: ({ rowData }) => getStatus(rowData.TrangThai),
        headerRenderer: ({ column }) => {
          return (
            <div className="w-100">
              <div className="mb-5px w-100 text-uppercase">{column.title}</div>
              <Select
                isClearable
                menuPosition="fixed"
                name={column.key}
                placeholder="Chọn trạng thái"
                classNamePrefix="select"
                options={StatusList}
                className="select-control w-100"
                value={StatusList.filter(
                  item => item.value === filters?.filter?.TrangThai
                )}
                onChange={otp => {
                  setFilters(prevState => ({
                    ...prevState,
                    filter: {
                      ...prevState.filter,
                      TrangThai: otp ? otp.value : ''
                    }
                  }))
                }}
              />
            </div>
          )
        }
      },
      {
        key: 'Src',
        title: 'Danh sách đăng ký',
        dataKey: 'Src',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        cellRenderer: ({ rowData }) => (
          <a
            href={`/upload/image/${rowData.Src}`}
            target="_blank"
            rel="noreferrer"
          >
            Tải danh sách
          </a>
        )
      },
      {
        key: 'Ten_Truong',
        title: 'Trường',
        dataKey: 'Ten_Truong',
        width: 225,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        headerRenderer: ({ column }) => {
          return (
            <div className="w-100">
              <div className="mb-5px w-100 text-uppercase">{column.title}</div>
              <input
                autoComplete="off"
                type="text"
                name={column.key}
                className="form-control w-100"
                placeholder="Nhập từ khóa"
                onChange={evt => {
                  setLoading(true)
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                  }
                  typingTimeoutRef.current = setTimeout(async () => {
                    const newFilters = {
                      ...filters
                    }
                    newFilters.filter[column.key] = evt.target.value
                    setFilters(newFilters)
                  }, 500)
                }}
              />
            </div>
          )
        }
      },
      {
        key: 'Giao_vien',
        title: 'Giáo viên hướng dẫn',
        dataKey: 'Giao_vien',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        headerRenderer: ({ column }) => {
          return (
            <div className="w-100">
              <div className="mb-5px w-100 text-uppercase">{column.title}</div>
              <input
                autoComplete="off"
                type="text"
                name={column.key}
                className="form-control w-100"
                placeholder="Nhập từ khóa"
                onChange={evt => {
                  setLoading(true)
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                  }
                  typingTimeoutRef.current = setTimeout(async () => {
                    const newFilters = {
                      ...filters
                    }
                    newFilters.filter[column.key] = evt.target.value
                    setFilters(newFilters)
                  }, 500)
                }}
              />
            </div>
          )
        }
      },
      {
        key: 'Ten_lop',
        title: 'Lớp',
        dataKey: 'Ten_lop',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        headerRenderer: ({ column }) => {
          return (
            <div className="w-100">
              <div className="mb-5px w-100 text-uppercase">{column.title}</div>
              <input
                autoComplete="off"
                type="text"
                name={column.key}
                className="form-control w-100"
                placeholder="Nhập từ khóa"
                onChange={evt => {
                  setLoading(true)
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                  }
                  typingTimeoutRef.current = setTimeout(async () => {
                    const newFilters = {
                      ...filters
                    }
                    newFilters.filter[column.key] = evt.target.value
                    setFilters(newFilters)
                  }, 500)
                }}
              />
            </div>
          )
        }
      },
      {
        key: 'Ten_nhom',
        title: 'Tên nhóm',
        dataKey: 'Ten_nhom',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        headerRenderer: ({ column }) => {
          return (
            <div className="w-100">
              <div className="mb-5px w-100 text-uppercase">{column.title}</div>
              <input
                autoComplete="off"
                type="text"
                name={column.key}
                className="form-control w-100"
                placeholder="Nhập từ khóa"
                onChange={evt => {
                  setLoading(true)
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                  }
                  typingTimeoutRef.current = setTimeout(async () => {
                    const newFilters = {
                      ...filters
                    }
                    newFilters.filter[column.key] = evt.target.value
                    setFilters(newFilters)
                  }, 500)
                }}
              />
            </div>
          )
        }
      },
      {
        key: 'Ten_sp',
        title: 'Sản phẩm',
        dataKey: 'Ten_sp',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        cellRenderer: ({ rowData }) => (
          <a
            href={`/upload/image/${rowData.SanPham}`}
            target="_blank"
            rel="noreferrer"
          >
            {rowData.Ten_sp}
          </a>
        ),
        headerRenderer: ({ column }) => {
          return (
            <div className="w-100">
              <div className="mb-5px w-100 text-uppercase">{column.title}</div>
              <input
                autoComplete="off"
                type="text"
                name={column.key}
                className="form-control w-100"
                placeholder="Nhập từ khóa"
                onChange={evt => {
                  setLoading(true)
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                  }
                  typingTimeoutRef.current = setTimeout(async () => {
                    const newFilters = {
                      ...filters
                    }
                    newFilters.filter[column.key] = evt.target.value
                    setFilters(newFilters)
                  }, 500)
                }}
              />
            </div>
          )
        }
      },
      {
        key: '#',
        title: 'Chi tiết',
        dataKey: '#',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
        },
        style: {
          position: 'relative'
        },
        cellRenderer: () => <span className="fw-500">Xem chi tiết</span>
      }
    ],
    [Selected, ListData]
  )

  const ExpandIcon = props => {
    let { expandable, expanded, onExpand } = props
    let cls = 'table__expandicon'

    if (expandable === false) {
      return null
    }

    if (expanded === true) {
      cls += ' expanded'
    }

    return (
      <div
        className={cls}
        onClick={() => {
          onExpand(!expanded)
        }}
      >
        <i className="fa-solid fa-caret-right"></i>
      </div>
    )
  }

  const rowRenderer = ({ rowData, cells }) => {
    if (rowData.content)
      return (
        <DetailRenderer rowData={rowData} cells={cells} filters={filters} />
      )
    return cells
  }

  return (
    <div className="py-main h-100">
      <div className="subheader d-flex justify-content-between align-items-center">
        <div className="flex-1">
          <span className="text-uppercase text-uppercase font-size-xl fw-600">
            Quản lý đăng ký dự thi
          </span>
        </div>
        <div className="d-flex justify-content-end">
          {Selected && Selected.length > 0 && (
            <div className="d-flex">
              <button
                className={clsx(
                  'btn btn-secondary',
                  loadingUpdate === 'CHUA_XEM' &&
                    'spinner spinner-white spinner-right'
                )}
                disabled={loadingUpdate === 'CHUA_XEM'}
                onClick={() => onChangeStatus('CHUA_XEM')}
              >
                Chưa xem
              </button>
              <button
                className={clsx(
                  'btn btn-success ml-6px',
                  loadingUpdate === 'DA_XEM' &&
                    'spinner spinner-white spinner-right'
                )}
                disabled={loadingUpdate === 'DA_XEM'}
                onClick={() => onChangeStatus('DA_XEM')}
              >
                Đã xem
              </button>
              <button
                className={clsx(
                  'btn btn-danger mx-6px',
                  loadingUpdate === 'XOA' &&
                    'spinner spinner-white spinner-right'
                )}
                disabled={loadingUpdate === 'XOA'}
                onClick={() => onChangeStatus('XOA')}
              >
                Xóa
              </button>
            </div>
          )}
          <button
            type="button"
            className={clsx(
              'btn btn-primary',
              loadingExport && 'spinner spinner-white spinner-right'
            )}
            onClick={onExport}
            disabled={loadingExport}
          >
            <i className="far fa-file-excel pr-8px"></i>Xuất Excel
          </button>
          <IconMenuMobile />
        </div>
      </div>
      <div className="bg-white rounded h-100">
        <ReactTableV7
          expandColumnKey={columns[10].key}
          estimatedRowHeight={50}
          headerHeight={[90]}
          rowKey="ID"
          filters={filters}
          columns={columns}
          data={ListData}
          loading={loading}
          pageCount={PageCount}
          onPagesChange={onPagesChange}
          components={{
            ExpandIcon: ExpandIcon
          }}
          rowRenderer={rowRenderer}
        />
      </div>
    </div>
  )
}

export default ContactList

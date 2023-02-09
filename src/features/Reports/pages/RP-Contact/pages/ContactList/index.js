import React, { useEffect, useMemo, useState } from 'react'
import FilterList from 'src/components/Filter/FilterList'
import IconMenuMobile from 'src/features/Reports/components/IconMenuMobile'
import _ from 'lodash'
import ReactTableV7 from 'src/components/Tables/ReactTableV7'
import reportsApi from 'src/api/reports.api'

import moment from 'moment'
import 'moment/locale/vi'
import { uuidv4 } from '@nikitababko/id-generator'

moment.locale('vi')

const DetailRenderer = ({ filters, ...props }) => {
  return '1'
}

function ContactList(props) {
  const [ListData, setListData] = useState([])
  const [PageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [filters, setFilters] = useState({
    Pi: 1,
    Ps: 15,
    filter: {
      Ten_Truong: ''
    }
  })
  const [loadingExport, setLoadingExport] = useState(false)

  useEffect(() => {
    getListContact()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListContact = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    reportsApi
      .getListContact(filters)
      .then(({ data }) => {
        const { Items, Total, PCounts } = {
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

  const onOpenFilter = () => {
    setIsFilter(true)
  }

  const onHideFilter = () => {
    setIsFilter(false)
  }

  const onFilter = values => {
    if (_.isEqual(values, filters)) {
      onRefresh()
    } else {
      setFilters({ ...values, Pi: 1 })
    }
  }

  const onRefresh = () => {}

  const onPagesChange = ({ Pi, Ps }) => {
    setFilters({ ...filters, Pi, Ps })
  }

  const onExport = () => {
    // PermissionHelpers.ExportExcel({
    //   FuncStart: () => setLoadingExport(true),
    //   FuncEnd: () => setLoadingExport(false),
    //   FuncApi: () =>
    //     reportsApi.getListUseCustomerApp(
    //       BrowserHelpers.getRequestParamsList(filters, {
    //         Total: PageTotal
    //       })
    //     ),
    //   UrlName: '/khach-hang/su-dung-app'
    // })
  }

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowIndex }) => (
          <label className="checkbox d-flex">
            <input type="checkbox" />
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
            <input type="checkbox" />
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
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'MobilePhone',
        title: 'Trạng thái',
        dataKey: 'MobilePhone',
        width: 150,
        sortable: false,
        mobileOptions: {
          visible: true
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
        width: 250,
        sortable: false,
        mobileOptions: {
          visible: true
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
        }
      },
      {
        key: 'MobilePhone5',
        title: 'Lớp',
        dataKey: 'MobilePhone5',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'MobilePhone7',
        title: 'Tên nhóm',
        dataKey: 'MobilePhone7',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
        }
      },
      {
        key: 'MobilePhone8',
        title: 'Sản phẩm',
        dataKey: 'MobilePhone8',
        width: 200,
        sortable: false,
        mobileOptions: {
          visible: true
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
    []
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
        <div className="w-85px d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary p-0 w-40px h-35px"
            onClick={onOpenFilter}
          >
            <i className="fa-regular fa-filters font-size-lg mt-5px"></i>
          </button>
          <IconMenuMobile />
        </div>
      </div>
      <FilterList
        show={isFilter}
        filters={filters}
        onHide={onHideFilter}
        onSubmit={onFilter}
        onRefresh={onRefresh}
        loading={loading}
        loadingExport={loadingExport}
        onExport={onExport}
      />
      <div className="bg-white rounded h-100">
        <ReactTableV7
          expandColumnKey={columns[10].key}
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

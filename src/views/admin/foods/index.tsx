import { Fragment, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { SpinnerRoundOutlined } from "spinners-react";
import ToastComponent from "../../../components/toast";
import { API_URL_DEV } from "../../../env/environment.dev";
import { IPaginateTableFoods } from "../../../model/admin.model";
import { IListFoods, ITypeFoods } from "../../../model/common.model";
import "../style.css";
import Pagination from "react-bootstrap/Pagination";
import { formatCurrencyVND } from "../../../shared/utils";

export default function AdminFoods() {
  const [typeFoods, setTypeFoods] = useState<ITypeFoods[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isToggleToast, setIsToggleToast] = useState(false);
  const [listFoods, setListFoods] = useState<IListFoods[]>([]);
  const [paginateTable, setPaginateTable] = useState<IPaginateTableFoods>({
    page: 1,
    limit: 2,
    totalItems: 0,
    totalPages: 0,
  });
  const [viewPaginates, setViewPaginates] = useState<any[]>([]);
  useEffect(() => {
    let items = [];
    if (paginateTable.totalPages)
      for (let number = 1; number <= paginateTable.totalPages; number++) {
        items.push(
          <Pagination.Item
            onClick={(item) => onChangePage(number)}
            key={number}
            active={number === paginateTable.page}
          >
            {number}
          </Pagination.Item>
        );
      }
    setViewPaginates(items);
  }, [paginateTable]);
  useEffect(() => {
    setPaginateTable((prevState: IPaginateTableFoods) => ({
      ...prevState,
      totalPages: Math.round(paginateTable.totalItems / paginateTable.limit),
    }));
  }, [paginateTable.totalItems]);
  function onChangePage(num: number) {
    setPaginateTable((prevState: IPaginateTableFoods) => ({
      ...prevState,
      page: num,
    }));
  }
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL_DEV}/typeFoods`)
      .then((response) => response.json())
      .then((data: ITypeFoods[]) => {
        setIsLoading(false);
        setTypeFoods(data);
      })
      .catch((error) => {
        setDescriptionToast("Đã xảy ra lỗi");
        handleToggleToast();
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    fetchListFoods();
  }, [paginateTable.page]);

  function fetchListFoods() {
    setIsLoading(true);
    fetch(
      `${API_URL_DEV}/foods?_page=${paginateTable.page}&_limit=${paginateTable.limit}`
    )
      .then((response) => {
        const totalItems = Number(response.headers.get("x-total-count"));
        setPaginateTable((prevState: IPaginateTableFoods) => ({
          ...prevState,
          totalItems,
        }));
        return response.json();
      })
      .then((data: IListFoods[]) => {
        setIsLoading(false);
        setListFoods(data);
      })
      .catch((error) => {
        setDescriptionToast("Đã xảy ra lỗi");
        handleToggleToast();
        setIsLoading(false);
      });
  }
  const handleToggleToast = () => setIsToggleToast(!isToggleToast);

  return (
    <>
      <ToastComponent
        description={descriptionToast}
        isToggle={isToggleToast}
        handleToggle={handleToggleToast}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên món ăn</th>
            <th>Thành tiền</th>
            <th>Ảnh</th>
            <th>Danh mục</th>
            <th>Loại sản phẩm</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SpinnerRoundOutlined />
          ) : (
            <Fragment>
              {listFoods.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.amount}</td>
                    <td>{formatCurrencyVND(item.price)}</td>
                    <td>
                      <img className="item-img-tb" src={item.imgUrl} />
                    </td>
                    <td>
                      {typeFoods.map((type) => {
                        return Number(item.typeFood) === type.value
                          ? type.name
                          : "";
                      })}
                    </td>
                    <td>{item.typeProduct}</td>
                    <td></td>
                  </tr>
                );
              })}
            </Fragment>
          )}
        </tbody>
        <div>
          <Pagination>{viewPaginates}</Pagination>
        </div>
      </Table>
    </>
  );
}

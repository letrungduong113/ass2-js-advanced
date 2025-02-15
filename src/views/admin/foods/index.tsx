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
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ModalComponent from "../../../components/modal";
import { FAKE_DATA_TYPE_PRODUCT } from "../../../shared/fake-data";

export default function AdminFoods() {
  const [typeFoods, setTypeFoods] = useState<ITypeFoods[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isToggleToast, setIsToggleToast] = useState<boolean>(false);
  const [listFoods, setListFoods] = useState<IListFoods[]>([]);
  const [paginateTable, setPaginateTable] = useState<IPaginateTableFoods>({
    page: 1,
    limit: 2,
    totalItems: 0,
    totalPages: 0,
  });
  const [viewPaginates, setViewPaginates] = useState<any[]>([]);
  const [isToggleModal, setIsToggleModal] = useState<boolean>(false);
  const [idFood, setIdFood] = useState<number | null>(null);
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
      totalPages: Math.ceil(paginateTable.totalItems / paginateTable.limit),
    }));
  }, [paginateTable.totalItems]);
  function onChangePage(num: number) {
    setPaginateTable((prevState: IPaginateTableFoods) => ({
      ...prevState,
      page: num,
    }));
  }
  const handleCloseModal = () => setIsToggleModal(false);
  const handleShowModal = (id: number) => {
    setIdFood(id);
    setIsToggleModal(true);
  };
  const handleConfirmDelete = () => {
    setIsLoading(true);
    fetch(`${API_URL_DEV}/foods/${idFood}`, {
      credentials: "same-origin", // 'include', default: 'omit'
      method: "DELETE", // 'GET', 'PUT', 'DELETE', etc.
    })
      .then((response) => response.json())
      .then((res) => {
        setIsLoading(false);
        setDescriptionToast("Xoá thành công");
        handleToggleToast();
        handleCloseModal();
        fetchListFoods();
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };
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
    <div className="mt-12">
      <ToastComponent
        description={descriptionToast}
        isToggle={isToggleToast}
        handleToggle={handleToggleToast}
      />
      <ModalComponent
        description="Bạn có muốn chắc chắn xoá sản phẩm này không?"
        show={isToggleModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmDelete}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="txt-center">STT</th>
            <th className="txt-center">Tên món ăn</th>
            <th className="txt-center">Thành tiền</th>
            <th className="txt-center">Ảnh</th>
            <th className="txt-center">Danh mục</th>
            <th className="txt-center">Loại sản phẩm</th>
            <th className="txt-center">Chức năng</th>
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
                    <td className="txt-center">{index + 1}</td>
                    <td className="txt-center">{item.amount}</td>
                    <td className="txt-center">
                      {formatCurrencyVND(item.price)}
                    </td>
                    <td className="txt-center">
                      <img className="item-img-tb" src={item.imgUrl} />
                    </td>
                    <td className="txt-center">
                      {typeFoods.map((type) => {
                        return Number(item.typeFood) === type.value
                          ? type.name
                          : "";
                      })}
                    </td>
                    <td className="txt-center">
                      {FAKE_DATA_TYPE_PRODUCT.map((item2) =>
                        item2.value === item.typeProduct ? item2.name : ""
                      )}
                    </td>
                    <td className="txt-center">
                      <Link to={`update-food/${item.id}`}>
                        <Button variant="warning">Sửa</Button>
                      </Link>
                      <Button
                        onClick={(e) => handleShowModal(item.id)}
                        className="mt-12"
                        variant="danger"
                      >
                        Xoá
                      </Button>
                    </td>
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
    </div>
  );
}

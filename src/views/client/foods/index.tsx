import { useEffect, useState } from "react";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import { SpinnerRoundOutlined } from "spinners-react";
import ToastComponent from "../../../components/toast";
import { API_URL_DEV } from "../../../env/environment.dev";
import { IPaginateTableFoods } from "../../../model/admin.model";
import { IListFoods } from "../../../model/common.model";
import { FAKE_DATA_TYPE_PRODUCT } from "../../../shared/fake-data";
import { formatCurrencyVND } from "../../../shared/utils";
import "./style.css";
export default function ClientFoods() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listFoods, setListFoods] = useState<IListFoods[]>([]);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isToggleToast, setIsToggleToast] = useState<boolean>(false);
  const [paginateTable, setPaginateTable] = useState<IPaginateTableFoods>({
    page: 1,
    limit: 4,
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
    const totalPages = Math.ceil(
      paginateTable.totalItems / paginateTable.limit
    );
    setPaginateTable((prevState: IPaginateTableFoods) => ({
      ...prevState,
      totalPages,
    }));
  }, [paginateTable.totalItems]);
  function onChangePage(num: number) {
    setPaginateTable((prevState: IPaginateTableFoods) => ({
      ...prevState,
      page: num,
    }));
  }
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
    <Container>
      <ToastComponent
        description={descriptionToast}
        isToggle={isToggleToast}
        handleToggle={handleToggleToast}
      />
      <Row>
        {isLoading ? (
          <SpinnerRoundOutlined />
        ) : (
          listFoods.map((item, index) => {
            return (
              <Col key={item.id} md={3}>
                <Row>
                  <Col md={12}>
                    <img className="img" src={item.imgUrl} />
                  </Col>
                  <Col md={6}>
                    <div className="mt-12 name-product">{item.nameFood}</div>
                  </Col>
                  <Col md={6}>
                    <div className="mt-12 txt-right type-product">
                      {FAKE_DATA_TYPE_PRODUCT.map((item2) =>
                        item2.value === item.typeProduct ? item2.name : ""
                      )}
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="txt-des">{item.description}</div>
                  </Col>
                  <Col className="wrp-choose-product" md={12}>
                    <Row>
                      <Col md={6}>
                        <div className="color-white cursor-pointer">Chọn</div>
                      </Col>
                      <Col className="txt-right color-white" md={6}>
                        {formatCurrencyVND(item.price)}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            );
          })
        )}

        <div>
          <Pagination>{viewPaginates}</Pagination>
        </div>
      </Row>
    </Container>
  );
}

import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { SpinnerRoundOutlined } from "spinners-react";
import ToastComponent from "../../../components/toast";
import { API_URL_DEV } from "../../../env/environment.dev";
import { IPaginateTableFoods } from "../../../model/admin.model";
import { IQueryStringUrlSearch } from "../../../model/client.model";
import { IListFoods, ITypeFoods } from "../../../model/common.model";
import { FAKE_DATA_TYPE_PRODUCT } from "../../../shared/fake-data";
import useQueryParam from "../../../shared/hooks/useQueryParam";
import { formatCurrencyVND } from "../../../shared/utils";
import "./style.css";
export default function ClientFoods() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listFoods, setListFoods] = useState<IListFoods[]>([]);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isToggleToast, setIsToggleToast] = useState<boolean>(false);
  const [typeFoods, setTypeFoods] = useState<ITypeFoods[]>([]);
  const [paginateTable, setPaginateTable] = useState<IPaginateTableFoods>({
    page: 1,
    limit: 4,
    totalItems: 0,
    totalPages: 0,
  });
  const [viewPaginates, setViewPaginates] = useState<any[]>([]);
  const [itemMenuActive, setItemMenuActive] = useState<ITypeFoods | null>(null);
  let [queryStringUrl, setQueryStringUrl] =
    useQueryParam<IQueryStringUrlSearch>("url");
  const [textSearch, setTextSearch] = useState<string>("");
  if (!queryStringUrl) {
    queryStringUrl = { q: "", typeFood: "" };
  }
  useEffect(() => {
    let items = [];
    if (paginateTable.totalPages)
      for (let number = 1; number <= paginateTable.totalPages; number++) {
        items.push(
          <Pagination.Item
            onClick={(item) => onChangePage(number)}
            key={number}
            active={number === paginateTable.page}
            className="mt-12"
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

  function handleSearch() {
    const url: IQueryStringUrlSearch = {
      q: textSearch,
      typeFood: String(itemMenuActive?.value),
    };
    setQueryStringUrl(url, { replace: true });
  }
  useEffect(() => {
    fetchListFoods();
  }, [paginateTable.page]);
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL_DEV}/typeFoods`)
      .then((response) => response.json())
      .then((data: ITypeFoods[]) => {
        setIsLoading(false);
        const itemAll: ITypeFoods = {
          id: 1,
          value: "",
          name: "Tất cả",
        };
        let newData = data.filter((item) => item.id !== 1);
        newData.unshift(itemAll);
        setTypeFoods(newData);
        let queryTypeFood = newData.find(
          (item) => item.value === Number(queryStringUrl?.typeFood)
        );

        const url: IQueryStringUrlSearch = {
          q: textSearch,
          typeFood: String(queryTypeFood?.value),
        };
        setQueryStringUrl(url, { replace: true });
        const itemActive = queryTypeFood ? queryTypeFood : itemAll;
        setItemMenuActive(itemActive);
      })
      .catch((error) => {
        setDescriptionToast("Đã xảy ra lỗi");
        handleToggleToast();
        setIsLoading(false);
      });
  }, []);
  function fetchListFoods() {
    setIsLoading(true);
    let url = `${API_URL_DEV}/foods?_page=${paginateTable.page}&_limit=${paginateTable.limit}`;
    url += queryStringUrl?.typeFood
      ? `&typeFood=${queryStringUrl?.typeFood}`
      : "";
    url += queryStringUrl?.q ? `&q=${queryStringUrl?.q}` : "";
    fetch(url)
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
  function changeMenuFilter(food: ITypeFoods) {
    setItemMenuActive(food);

    const url: IQueryStringUrlSearch = {
      q: textSearch,
      typeFood: String(food.value),
    };
    setQueryStringUrl(url, { replace: true });
  }
  return (
    <Container>
      <ToastComponent
        description={descriptionToast}
        isToggle={isToggleToast}
        handleToggle={handleToggleToast}
      />
      <Row>
        <Col className="mb-18" md={12}>
          <Row>
            <Col md={2}></Col>
            <Col md={6}>
              <Form.Control
                placeholder="Nhập tìm kiếm"
                onChange={(e) => setTextSearch(e.target.value)}
                type="text"
              />
            </Col>
            <Col md={2}>
              <Button onClick={handleSearch} variant="outline-info">
                Tìm kiếm
              </Button>
            </Col>
            <Col md={2}></Col>
          </Row>
        </Col>
        <Col className="mb-18" md={12}>
          <Row>
            {typeFoods.map((food) => {
              return (
                <Col key={food.id} md={2}>
                  <div
                    onClick={() => changeMenuFilter(food)}
                    className={
                      itemMenuActive?.id === food.id
                        ? "menu-active menu-filter"
                        : "menu-filter"
                    }
                  >
                    {food.name}
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>

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

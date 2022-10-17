import {useEffect, useState} from "react";
import {Button, Col, Container, Form, Pagination, Row} from "react-bootstrap";
import {createSearchParams, Link, useNavigate, useSearchParams} from "react-router-dom";
import {SpinnerRoundOutlined} from "spinners-react";
import ToastComponent from "../../../components/toast";
import {API_URL_DEV} from "../../../env/environment.dev";
import {IPaginateTableFoods} from "../../../model/admin.model";
import {IQueryStringUrlSearch, TProductsInCart,} from "../../../model/client.model";
import {IListFoods, ITypeFoods} from "../../../model/common.model";
import {FAKE_DATA_TYPE_PRODUCT} from "../../../shared/fake-data";
import {formatCurrencyVND} from "../../../shared/utils";
import cart from "../../../assets/imgs/icons8-shopping-cart-30.png";

import "./style.css";

export default function ClientFoods() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingProductInCart, setIsLoadingProductInCart] =
        useState<boolean>(false);
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
    const [productsInCart, setProductsInCart] = useState<TProductsInCart[]>([]);
    const [itemMenuActive, setItemMenuActive] = useState<ITypeFoods | null | undefined>(null);

    const [queryStringSearch, setQueryStringSearch] =
        useState<IQueryStringUrlSearch>({
            q: "",
            typeFood: "",
        });
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const typeFood = searchParams.get('typeFood');
    const qSearch = searchParams.get('q');
    useEffect(() => {
        if (typeFood) setQueryStringSearch((prevState: IQueryStringUrlSearch) => ({
            ...prevState,
            typeFood: String(typeFood),
        }));
        if (qSearch) setQueryStringSearch((prevState: IQueryStringUrlSearch) => ({
            ...prevState,
            q: qSearch,
        }));

        if (typeFoods) {
            const itemActive = typeFoods.find(item => item.id === Number(typeFood));
            setItemMenuActive(itemActive);
        }
    }, [typeFood, qSearch, typeFoods]);
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
        navigate({
            pathname: "/",
            search: `?${createSearchParams({
                q: queryStringSearch.q,
                typeFood: queryStringSearch.typeFood,
            })}`,
        });
    }, [queryStringSearch]);
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
        if (queryStringSearch.q) fetchListFoods();
    }

    useEffect(() => {
        fetchListFoods();
    }, [paginateTable.page, queryStringSearch.typeFood]);
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

                setItemMenuActive(itemAll);
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
        url += queryStringSearch?.typeFood
            ? `&typeFood=${queryStringSearch?.typeFood}`
            : "";
        url += queryStringSearch?.q ? `&q=${queryStringSearch?.q}` : "";
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

    useEffect(() => {
        fetchProductsInCart();
    }, []);

    function fetchProductsInCart() {
        setIsLoading(true);
        fetch(`${API_URL_DEV}/carts`)
            .then((response) => response.json())
            .then((data: TProductsInCart[]) => {
                setIsLoading(false);
                setProductsInCart(data);
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
        setPaginateTable((prevState: IPaginateTableFoods) => ({
            ...prevState,
            page: 1,
        }));
        setQueryStringSearch((prevState: IQueryStringUrlSearch) => ({
            ...prevState,
            typeFood: String(food.value),
        }));
    }

    function handleAddProductInCart(product: IListFoods) {
        let itemProduct = productsInCart.find((item) => item.id === product.id);
        if (itemProduct) updateProductInCart(itemProduct);
        else createProductInCart(product);
    }

    function updateProductInCart(currentProduct: TProductsInCart) {
        currentProduct.amount = Number(currentProduct.amount) + 1;
        setIsLoadingProductInCart(true);
        fetch(`${API_URL_DEV}/carts/${currentProduct.id}`, {
            credentials: "same-origin",
            method: "PUT", // 'GET', 'PUT', 'DELETE', etc.
            body: JSON.stringify(currentProduct),
            headers: {"Content-Type": "application/json"},
        })
            .then((response) => response.json())
            .then((res) => {
                setIsLoadingProductInCart(false);
                setDescriptionToast("Cập nhật sản phẩm ở giỏ hàng thành công");
                handleToggleToast();
            })
            .catch((error) => {
                console.error(error);
                setIsLoadingProductInCart(false);
            });
    }

    function createProductInCart(product: IListFoods) {
        const payload: TProductsInCart = {
            id: product.id,
            nameFood: product.nameFood,
            price: product.price,
            amount: 1,
            imgUrl: product.imgUrl,
        };
        setIsLoadingProductInCart(true);
        fetch(`${API_URL_DEV}/carts`, {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(payload),
            headers: {"Content-Type": "application/json"},
        })
            .then((response) => response.json())
            .then((res) => {
                setIsLoadingProductInCart(false);
                setDescriptionToast("Thêm sản phẩm vào giỏ hàng thành công");
                handleToggleToast();
                fetchProductsInCart();
            })
            .catch((error) => {
                console.error(error);
                setIsLoadingProductInCart(false);
            });
    }

    return (
        <Container>
            {isLoadingProductInCart ? <SpinnerRoundOutlined/> : ""}
            <ToastComponent
                description={descriptionToast}
                isToggle={isToggleToast}
                handleToggle={handleToggleToast}
            />
            <Row className="wrp-content">
                <Col className="mb-18" md={12}>
                    <Row>
                        <Col md={2}></Col>
                        <Col md={6}>
                            <Form.Control
                                value={queryStringSearch.q  || ''}
                                placeholder="Nhập tìm kiếm"
                                name="q"
                                onChange={(e) =>
                                    setQueryStringSearch((prevState: IQueryStringUrlSearch) => ({
                                        ...prevState,
                                        q: e.target.value,
                                    }))
                                }

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
                    <SpinnerRoundOutlined/>
                ) : (
                    listFoods.map((item, index) => {
                        return (
                            <Col key={item.id} md={3}>
                                <Row>
                                    <Col md={12}>
                                        <img className="img" src={item.imgUrl}/>
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
                                                <div
                                                    onClick={(e) => handleAddProductInCart(item)}
                                                    className="color-white cursor-pointer"
                                                >
                                                    Chọn
                                                </div>
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

                <Col md={12} className="cart">
                    <Link to="/cart">
                        <img className="img-cart" src={cart}/>
                    </Link>
                    <div className="total-cart">
                        {productsInCart?.length > 0 ? productsInCart.length : ""}
                    </div>
                </Col>

                <Col md={12}>
                    <Pagination>{viewPaginates}</Pagination>
                </Col>
            </Row>
        </Container>
    );
}

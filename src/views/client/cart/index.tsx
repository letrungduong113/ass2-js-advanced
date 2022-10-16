import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerRoundOutlined } from "spinners-react";
import ModalComponent from "../../../components/modal";
import ToastComponent from "../../../components/toast";
import { API_URL_DEV } from "../../../env/environment.dev";
import { TProductsInCart } from "../../../model/client.model";
import { formatCurrencyVND } from "../../../shared/utils";

const Cart = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isToggleToast, setIsToggleToast] = useState<boolean>(false);
  const [productsInCart, setProductsInCart] = useState<TProductsInCart[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isToggleModal, setIsToggleModal] = useState<boolean>(false);
  const [idProduct, setIdProduct] = useState<number | null>(null);
  useEffect(() => {
    fetchProductsInCart();
  }, []);

  function fetchProductsInCart() {
    setIsLoading(true);
    fetch(`${API_URL_DEV}/carts`)
      .then((response) => response.json())
      .then((data: TProductsInCart[]) => {
        setIsLoading(false);
        let totalPrice = 0;
        for (let i = 0; i < data.length; i++) {
          totalPrice += Number(data[i].price) * Number(data[i].amount);
        }
        setTotalPrice(totalPrice);
        setProductsInCart(data);
      })
      .catch((error) => {
        setDescriptionToast("Đã xảy ra lỗi");
        handleToggleToast();
        setIsLoading(false);
      });
  }
  const handleCloseModal = () => setIsToggleModal(false);
  const handleShowModal = (id: number) => {
    setIdProduct(id);
    setIsToggleModal(true);
  };
  const handleConfirmDelete = () => {
    setIsLoading(true);
    fetch(`${API_URL_DEV}/carts/${idProduct}`, {
      credentials: "same-origin", // 'include', default: 'omit'
      method: "DELETE", // 'GET', 'PUT', 'DELETE', etc.
    })
      .then((response) => response.json())
      .then((res) => {
        setIsLoading(false);
        setDescriptionToast("Xoá thành công");
        handleToggleToast();
        handleCloseModal();
        fetchProductsInCart();
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };
  function updateProductInCart(
    currentProduct: TProductsInCart,
    isAdd: boolean = false
  ) {
    if (currentProduct.amount < 2 && !isAdd) {
      handleShowModal(currentProduct.id);
      return;
    }
    currentProduct.amount = isAdd
      ? Number(currentProduct.amount) + 1
      : Number(currentProduct.amount) - 1;
    fetch(`${API_URL_DEV}/carts/${currentProduct.id}`, {
      credentials: "same-origin",
      method: "PUT", // 'GET', 'PUT', 'DELETE', etc.
      body: JSON.stringify(currentProduct),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        fetchProductsInCart();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const handleToggleToast = () => setIsToggleToast(!isToggleToast);
  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#d2c9ff" }}>
      <ToastComponent
        description={descriptionToast}
        isToggle={isToggleToast}
        handleToggle={handleToggleToast}
      />
      <ModalComponent
        description="Bạn có muốn chắc chắn xoá sản phẩm này khỏi giỏ hàng?"
        show={isToggleModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmDelete}
      />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div
              className="card card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <h1 className="fw-bold mb-0 text-black">Giỏ hàng</h1>
                        <h6 className="mb-0 text-muted">
                          {productsInCart?.length} sản phẩm
                        </h6>
                      </div>
                      {isLoading ? (
                        <SpinnerRoundOutlined />
                      ) : productsInCart?.length < 1 ? (
                        <div>Không có sản phẩm nào trong giỏ hàng</div>
                      ) : (
                        productsInCart.map((item) => {
                          return (
                            <div key={item.id}>
                              <hr className="my-4"></hr>

                              <div className="row mb-4 d-flex justify-content-between align-items-center">
                                <div className="col-md-2 col-lg-2 col-xl-2">
                                  <img
                                    src={item.imgUrl}
                                    className="img-fluid rounded-3"
                                    alt="Cotton T-shirt"
                                  ></img>
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-3">
                                  <h6 className="text-black mb-0">
                                    {item.nameFood}
                                  </h6>
                                </div>
                                <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                  <button
                                    onClick={() =>
                                      updateProductInCart(item, false)
                                    }
                                    className="btn btn-link px-2"
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>

                                  <input
                                    min="0"
                                    value={item.amount}
                                    type="number"
                                    className="form-control form-control-sm"
                                  />

                                  <button
                                    onClick={() =>
                                      updateProductInCart(item, true)
                                    }
                                    className="btn btn-link px-2"
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                                <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                  <h6 className="mb-0">
                                    {formatCurrencyVND(item.price)}
                                  </h6>
                                </div>
                                <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                  <div
                                    onClick={(e) => handleShowModal(item.id)}
                                    className="text-muted cursor-pointer"
                                  >
                                    <i className="fas fa-times"></i>
                                  </div>
                                </div>
                              </div>
                              <hr className="my-4"></hr>
                            </div>
                          );
                        })
                      )}

                      <div className="pt-5">
                        <h6 className="mb-0">
                          <Link to="/" className="text-body">
                            <i className="fas fa-long-arrow-alt-left me-2"></i>
                            Trở về trang chủ
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 bg-grey">
                    <div className="p-5">
                      <h3 className="fw-bold mb-5 mt-2 pt-1">
                        Chi tiêt đơn hàng
                      </h3>

                      <hr className="my-4"></hr>

                      <div className="d-flex justify-content-between mb-5">
                        <h5 className="text-uppercase">Tổng tiền</h5>
                        <h5>{formatCurrencyVND(totalPrice)}</h5>
                      </div>

                      <button
                        type="button"
                        className="btn btn-dark btn-block btn-lg"
                        data-mdb-ripple-color="dark"
                      >
                        Thanh toán
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;

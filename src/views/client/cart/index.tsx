import { useEffect, useState } from "react";
import { SpinnerRoundOutlined } from "spinners-react";
import ToastComponent from "../../../components/toast";
import { API_URL_DEV } from "../../../env/environment.dev";
import { TProductsInCart } from "../../../model/client.model";
import { formatCurrencyVND } from "../../../shared/utils";

const Cart = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isToggleToast, setIsToggleToast] = useState<boolean>(false);
  const [productsInCart, setProductsInCart] = useState<TProductsInCart[]>([]);
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
  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#d2c9ff" }}>
      <ToastComponent
        description={descriptionToast}
        isToggle={isToggleToast}
        handleToggle={handleToggleToast}
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
                      ) : (
                        productsInCart.map((item) => {
                          return (
                            <div>
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
                                  <button className="btn btn-link px-2">
                                    <i className="fas fa-minus"></i>
                                  </button>

                                  <input
                                    min="0"
                                    name="quantity"
                                    value={item.amount}
                                    type="number"
                                    className="form-control form-control-sm"
                                  />

                                  <button className="btn btn-link px-2">
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                                <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                  <h6 className="mb-0">
                                    {formatCurrencyVND(item.price)}
                                  </h6>
                                </div>
                                <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                  <a href="#!" className="text-muted">
                                    <i className="fas fa-times"></i>
                                  </a>
                                </div>
                              </div>
                              <hr className="my-4"></hr>
                            </div>
                          );
                        })
                      )}

                      <div className="pt-5">
                        <h6 className="mb-0">
                          <a href="#!" className="text-body">
                            <i className="fas fa-long-arrow-alt-left me-2"></i>
                            Trở về trang chủ
                          </a>
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

                      <h5 className="text-uppercase mb-3">Shipping</h5>

                      <div className="mb-4 pb-2">
                        <select className="select">
                          <option value="1">Standard-Delivery- €5.00</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                          <option value="4">Four</option>
                        </select>
                      </div>

                      <h5 className="text-uppercase mb-3">Give code</h5>

                      <div className="mb-5">
                        <div className="form-outline">
                          <input
                            type="text"
                            id="form3Examplea2"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label">Enter your code</label>
                        </div>
                      </div>

                      <hr className="my-4"></hr>

                      <div className="d-flex justify-content-between mb-5">
                        <h5 className="text-uppercase">Tổng tiền</h5>
                        <h5>€ 137.00</h5>
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

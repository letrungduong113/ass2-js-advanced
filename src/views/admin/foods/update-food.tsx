import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../style.css";
import Categories from "../categories";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { ITypeFoods } from "../../../model/common.model";
import { API_UPLOAD_IMG, API_URL_DEV } from "../../../env/environment.dev";
import { SpinnerRoundOutlined } from "spinners-react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
  IMessErrors,
  IPayloadDetailFood,
  IPayloadUpdateFood,
  IResUploadFile,
} from "../../../model/admin.model";
import ToastComponent from "../../../components/toast";
import { ImagePreview } from "../../../components/imgPreview";
import { FAKE_DATA_TYPE_PRODUCT } from "../../../shared/fake-data";
const UpdateFood = () => {
  const { id } = useParams<"id">();
  const [typeFoods, setTypeFoods] = useState<ITypeFoods[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [descriptionToast, setDescriptionToast] = useState<string>("");
  const [isLoadingCreate, setIsLoadingUpdate] = useState<boolean>(false);
  const [isToggleToast, setIsToggleToast] = useState<boolean>(false);
  const [payload, setPayload] = useState<IPayloadUpdateFood>({
    typeProduct: "",
    nameFood: "",
    typeFood: "",
    price: "",
    amount: "",
    description: "",
    imgUrl: "",
  });
  const [messErrs, setMessErrs] = useState<IMessErrors>({
    typeProduct: "",
    nameFood: "",
    typeFood: "",
    price: "",
    amount: "",
    description: "",
    imgUrl: "",
  });
  const [fileUpload, setFileUpload] = useState<any | null>(null);
  const [imgData, setImgData] = useState<any | null>(null);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { typeProduct } = payload;
  const navigate = useNavigate();
  const handleToggleToast = () => setIsToggleToast(!isToggleToast);
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
    setIsLoadingUpdate(true);
    fetch(`${API_URL_DEV}/foods/${id}`, {
      credentials: "same-origin",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res: IPayloadDetailFood) => {
        setIsLoadingUpdate(false);
        setPayload((prevState: IPayloadUpdateFood) => ({
          ...prevState,
          typeProduct: res.typeProduct,
          nameFood: res.nameFood,
          typeFood: res.typeFood,
          price: res.price,
          amount: res.amount,
          description: res.description,
          imgUrl: res.imgUrl,
        }));
        setMessErrs((prevState: IMessErrors) => ({
          ...prevState,
          typeProduct: "",
          nameFood: "",
          typeFood: "",
          price: "",
          amount: "",
          description: "",
          imgUrl: "",
        }));
        setImgData(res.imgUrl);
        setFileUpload(res.imgUrl);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingUpdate(false);
      });
  }, [id]);
  useEffect(() => {
    if (payload.imgUrl && isSubmit) putUpdateFood();
  }, [payload, isSubmit]);
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isValidationForm()) return;
    setIsSubmit(true);
    const formData = new FormData();
    formData.append("img", fileUpload);
    setIsLoadingUpdate(true);
    fetch(API_UPLOAD_IMG, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res: IResUploadFile) => {
        setPayload((prevState: IPayloadUpdateFood) => ({
          ...prevState,
          imgUrl: res.imgLink,
        }));
        setIsLoadingUpdate(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingUpdate(false);
      });
  };

  function isValidationForm(): boolean {
    let isFlag = true;
    const { nameFood, typeFood, price, amount, typeProduct } = payload;
    if (nameFood.length < 1) {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        nameFood: "Vui lòng nhập tên món ăn",
      }));
      isFlag = false;
    } else {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        nameFood: "",
      }));
      isFlag = true;
    }
    if (!typeFood) {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        typeFood: "Vui lòng chọn loại món ăn",
      }));
      isFlag = false;
    } else {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        typeFood: "",
      }));
      isFlag = true;
    }
    if (!price) {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        price: "Vui lòng nhập thành tiền",
      }));
      isFlag = false;
    } else {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        price: "",
      }));
      isFlag = true;
    }
    if (!amount) {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        amount: "Vui lòng nhập số lượng",
      }));
      isFlag = false;
    } else {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        amount: "",
      }));
      isFlag = true;
    }
    if (!typeProduct) {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        typeProduct: "Vui lòng chọn loại sản phẩm",
      }));
      isFlag = false;
    } else {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        typeProduct: "",
      }));
      isFlag = true;
    }
    if (!fileUpload) {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        imgUrl: "Vui lòng upload ảnh",
      }));
      isFlag = false;
    } else {
      setMessErrs((prevState: IMessErrors) => ({
        ...prevState,
        imgUrl: "",
      }));
      isFlag = true;
    }
    return isFlag;
  }

  function putUpdateFood() {
    setIsLoadingUpdate(true);
    fetch(`${API_URL_DEV}/foods/${id}`, {
      credentials: "same-origin", // 'include', default: 'omit'
      method: "PUT", // 'GET', 'PUT', 'DELETE', etc.
      body: JSON.stringify(payload), // Use correct payload (matching 'Content-Type')
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        setIsLoadingUpdate(false);
        setDescriptionToast("Cập nhật thành công");
        handleToggleToast();
        setTimeout(() => {
          navigate("/admin");
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingUpdate(false);
      });
  }

  const handleChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();

    setPayload((prevState: IPayloadUpdateFood) => ({
      ...prevState,
      typeProduct: e.target.value,
    }));
  };

  function handleChangeUploadFile(event: any) {
    const file = event.target?.files?.item(0);
    setFileUpload(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgData(reader.result);
    });
    reader.readAsDataURL(file);
  }

  const handleRemoveImgPreview = () => {
    setFileUpload(null);
    setImgData(null);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="wrp-toast">
          <ToastComponent
            description={descriptionToast}
            isToggle={isToggleToast}
            handleToggle={handleToggleToast}
          />
        </div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Món ăn</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Danh mục</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Row>
                    <Col sm={12}>
                      <Stack direction="horizontal" gap={2}>
                        <div className="">Cập nhật món ăn</div>
                      </Stack>
                    </Col>
                    {isLoading ? (
                      <SpinnerRoundOutlined />
                    ) : (
                      <Col sm={12}>
                        <Form>
                          <Row>
                            <Col sm={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Tên món ăn</Form.Label>
                                <Form.Control
                                  value={payload.nameFood}
                                  type="text"
                                  placeholder="Nhập tên món ăn"
                                  name="nameFood"
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadUpdateFood) => ({
                                        ...prevState,
                                        nameFood: e.target.value,
                                      })
                                    )
                                  }
                                />
                                <div className="mess-err">
                                  {messErrs.nameFood}
                                </div>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Loại món ăn</Form.Label>
                                <Form.Select
                                  value={payload.typeFood}
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadUpdateFood) => ({
                                        ...prevState,
                                        typeFood: Number(e.target.value),
                                      })
                                    )
                                  }
                                >
                                  {typeFoods.map((item) => (
                                    <option key={item.id} value={item.value}>
                                      {item.name}
                                    </option>
                                  ))}
                                </Form.Select>
                                <div className="mess-err">
                                  {messErrs.typeFood}
                                </div>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Thành tiền</Form.Label>
                                <Form.Control
                                  value={payload.price}
                                  type="number"
                                  placeholder="Nhập thành tiền"
                                  name="price"
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadUpdateFood) => ({
                                        ...prevState,
                                        price: parseFloat(e.target.value),
                                      })
                                    )
                                  }
                                />
                                <div className="mess-err">{messErrs.price}</div>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                  value={payload.amount}
                                  type="number"
                                  placeholder="Nhập số lượng"
                                  name="amount"
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadUpdateFood) => ({
                                        ...prevState,
                                        amount: Number(e.target.value),
                                      })
                                    )
                                  }
                                />
                                <div className="mess-err">
                                  {messErrs.amount}
                                </div>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <FloatingLabel label="">
                                  <Form.Control
                                    value={payload.description}
                                    as="textarea"
                                    placeholder="Nhập mô tả"
                                    style={{ height: "100px" }}
                                    onChange={(e) =>
                                      setPayload(
                                        (prevState: IPayloadUpdateFood) => ({
                                          ...prevState,
                                          description: e.target.value,
                                        })
                                      )
                                    }
                                  />
                                </FloatingLabel>
                              </Form.Group>
                            </Col>
                            <Col sm={6}>
                              <Row>
                                <Col sm={12}>
                                  {fileUpload ? (
                                    <ImagePreview
                                      handleRemove={handleRemoveImgPreview}
                                      imgData={imgData}
                                    />
                                  ) : (
                                    <Form.Group
                                      controlId="formFile"
                                      className="mb-3"
                                    >
                                      <Form.Label>Hình ảnh</Form.Label>
                                      <Form.Control
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) =>
                                          handleChangeUploadFile(
                                            e as React.ChangeEvent<HTMLInputElement>
                                          )
                                        }
                                      />
                                      <div className="mess-err">
                                        {messErrs.imgUrl}
                                      </div>
                                    </Form.Group>
                                  )}
                                </Col>
                                <Col sm={3}>
                                  <Form.Label>Sản phẩm</Form.Label>
                                </Col>
                                {FAKE_DATA_TYPE_PRODUCT.map((item, index) => {
                                  return (
                                    <Col sm={3} key={item.id}>
                                      <Form.Check
                                        inline
                                        value={item.value}
                                        label={item.name}
                                        type="radio"
                                        checked={typeProduct === item.value}
                                        onChange={(e) => handleChangeRadio(e)}
                                      />
                                    </Col>
                                  );
                                })}
                                <Col sm={12}>
                                  <div className="mess-err">
                                    {messErrs.typeProduct}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col sm={12}>
                              <Button
                                className="mr-12"
                                variant="primary"
                                type="submit"
                                onClick={(e) => onSubmit(e)}
                              >
                                Xác nhận
                              </Button>

                              <Link to="/admin">
                                <Button variant="secondary">Huỷ</Button>
                              </Link>
                            </Col>
                            <Col sm={12}>
                              {isLoadingCreate ? (
                                <SpinnerRoundOutlined />
                              ) : (
                                <div></div>
                              )}
                            </Col>
                          </Row>
                        </Form>
                      </Col>
                    )}
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Categories />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
};

export default UpdateFood;

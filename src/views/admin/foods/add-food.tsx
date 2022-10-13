import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Link, useNavigate } from "react-router-dom";
import "../style.css";
import Categories from "../categories";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { ITypeFoods } from "../../../model/common.model";
import { API_UPLOAD_IMG, API_URL_DEV } from "../../../env/environment.dev";
import { SpinnerRoundOutlined } from "spinners-react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { IPayloadCreateFood, IResUploadFile } from "../../../model/admin.model";

export default function AddFood() {
  const [typeFoods, setTypeFoods] = useState<ITypeFoods[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [payload, setPayload] = useState<IPayloadCreateFood>({
    typeProduct: "",
    nameFood: "",
    typeFood: "",
    price: "",
    amount: "",
    description: "",
    imgUrl: "",
  });
  const [fileUpload, setFileUpload] = useState<any | null>(null);
  const { typeProduct } = payload;
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetch(`${API_URL_DEV}/typeFoods`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: ITypeFoods[]) => {
        setIsLoading(false);
        setTypeFoods(data);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    return () => controller.abort();
  }, []);
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", fileUpload);
    setIsLoadingCreate(true);
    fetch(API_UPLOAD_IMG, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res: IResUploadFile) => {
        setPayload((prevState: IPayloadCreateFood) => ({
          ...prevState,
          imgUrl: res.imgLink,
        }));
        setIsLoadingCreate(false);
        postCreateFood();
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingCreate(false);
      });
  };

  function postCreateFood() {
    setIsLoadingCreate(true);
    fetch(`${API_URL_DEV}/foods`, {
      credentials: "same-origin", // 'include', default: 'omit'
      method: "POST", // 'GET', 'PUT', 'DELETE', etc.
      body: JSON.stringify(payload), // Use correct payload (matching 'Content-Type')
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        setIsLoadingCreate(false);
        navigate("/admin");
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingCreate(false);
      });
  }

  const handleChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();

    setPayload((prevState: IPayloadCreateFood) => ({
      ...prevState,
      typeProduct: e.target.value,
    }));
  };

  function handleChangeUploadFile(event: any) {
    setFileUpload(event.target?.files?.item(0));
  }

  return (
    <div className="container">
      <div className="row">
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
                        <div className="">Thêm mới món ăn</div>
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
                                  type="text"
                                  placeholder="Nhập tên món ăn"
                                  name="nameFood"
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadCreateFood) => ({
                                        ...prevState,
                                        nameFood: e.target.value,
                                      })
                                    )
                                  }
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Loại món ăn</Form.Label>
                                <Form.Select
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadCreateFood) => ({
                                        ...prevState,
                                        typeFood: e.target.value,
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
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Thành tiền</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Nhập thành tiền"
                                  name="price"
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadCreateFood) => ({
                                        ...prevState,
                                        price: e.target.value,
                                      })
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Nhập số lượng"
                                  name="amount"
                                  onChange={(e) =>
                                    setPayload(
                                      (prevState: IPayloadCreateFood) => ({
                                        ...prevState,
                                        amount: e.target.value,
                                      })
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <FloatingLabel label="">
                                  <Form.Control
                                    as="textarea"
                                    placeholder="Nhập mô tả"
                                    style={{ height: "100px" }}
                                    onChange={(e) =>
                                      setPayload(
                                        (prevState: IPayloadCreateFood) => ({
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
                                  </Form.Group>
                                </Col>
                                <Col sm={3}>
                                  <Form.Label>Sản phẩm</Form.Label>
                                </Col>
                                <Col sm={3}>
                                  <Form.Check
                                    inline
                                    value="1"
                                    label="Mới"
                                    type="radio"
                                    checked={typeProduct === "1"}
                                    onChange={(e) => handleChangeRadio(e)}
                                  />
                                </Col>

                                <Col sm={3}>
                                  <Form.Check
                                    inline
                                    value="2"
                                    label="Truyền thống"
                                    type="radio"
                                    checked={typeProduct === "2"}
                                    onChange={(e) => handleChangeRadio(e)}
                                  />
                                </Col>
                                <Col sm={3}>
                                  <Form.Check
                                    inline
                                    value="3"
                                    label="Phải thử"
                                    type="radio"
                                    checked={typeProduct === "3"}
                                    onChange={(e) => handleChangeRadio(e)}
                                  />
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
                              {isLoadingCreate ? (
                                <SpinnerRoundOutlined />
                              ) : (
                                <div></div>
                              )}
                              <Link to="/admin">
                                <Button variant="secondary">Huỷ</Button>
                              </Link>
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
}

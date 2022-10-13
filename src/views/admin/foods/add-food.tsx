import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import "../style.css";
import Categories from "../categories";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { ITypeFoods } from "../../../model/common.model";
import { API_URL_DEV } from "../../../env/environment.dev";
import { SpinnerRoundOutlined } from "spinners-react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { IPayloadCreateFood } from "../../../model/admin.model";

export default function AddFood() {
  const [typeFoods, setTypeFoods] = useState<ITypeFoods[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<IPayloadCreateFood>({
    typeProduct: "",
    nameFood: "",
    typeFood: "",
    price: 0,
    amount: 0,
    description: "",
    imgUrl: "",
  });
  const { typeProduct } = payload;
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL_DEV}/typeFoods`)
      .then((response) => response.json())
      .then((data: ITypeFoods[]) => {
        setIsLoading(false);
        setTypeFoods(data);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  const handleChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();

    setPayload((prevState: IPayloadCreateFood) => ({
      ...prevState,
      typeProduct: e.target.value,
    }));
  };

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
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Loại món ăn</Form.Label>
                                <Form.Select>
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
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Nhập số lượng"
                                  name="amount"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <FloatingLabel label="">
                                  <Form.Control
                                    as="textarea"
                                    placeholder="Nhập mô tả"
                                    style={{ height: "100px" }}
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
                                    <Form.Control type="file" />
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
                              <SpinnerRoundOutlined />
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

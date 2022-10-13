import { Table } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Categories from "./categories";
export default function AdminFoods() {
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
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên món ăn</th>
                        <th>Thành tiền</th>
                        <th>Ảnh</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th>Chức năng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td colSpan={2}>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Categories/>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
}

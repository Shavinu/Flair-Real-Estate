import { Link } from "react-router-dom";
import { Button, Card, Col, ContentHeader, Row } from "../../../Components";
import CardBody from "../../../Components/Card/CardBody";

const Create = () => {
  return <>
    <ContentHeader headerTitle="Create New User"
      breadcrumb={[
        { name: "Home", link: "/" },
        { name: "Users", link: "/users" },
        { name: "Create", active: true },
      ]}
      options={<Button className="btn btn-primary waves-effect waves-light">Save</Button>}
    />
    <Row>
      <Col md={8}>
        <Card>
          <CardBody>
            abc
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardBody>
            abc
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
}

export default Create;

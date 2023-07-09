import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import "./HomeHero.css";
import CardBody from "./Card/CardBody";
import { useState } from "react";
import Select from 'react-select';
import { CheckBox, Label } from "./Form";
import { Col, Row } from "./Grid";
import SearchLocations from "./Maps/SearchBased";
import { PriceRangeInput } from "../Pages/Project/Search";

function HomeHeroWithSearch(props) {
  const [search, setSearch] = useState('');

  const handleSearch = () => {

  }



  return (
    <>
      <div className={props.cName}>
        <img src={props.heroImg} alt="heroImg" />
        <div className="hero-text">
          <h1>{props.title}</h1>
          <p>{props.text}</p>
          <Container>
            <Card className="p-4">
              <CardBody>
                <InputGroup className="rounded">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    name="search"
                    value={search}
                    onChange={handleSearch}
                    className="rounded-0"
                  />

                  <Button variant="secondary">Search</Button>
                </InputGroup>

                <Form.Group className="mt-2">
                  <CheckBox label="Surrounding Suburbs" />
                </Form.Group>

                <Form.Group>
                  <Row>
                  </Row>
                </Form.Group>

                <Form.Group>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Label>Project Type</Label>
                        <Select options={[
                          { value: 'land', label: 'Land' },
                          { value: 'project', label: 'Project' }
                        ]}></Select>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Label>Project Price Range</Label>
                      <PriceRangeInput
                        min={0}
                        max={2000000}
                        step={[
                          { till: 500000, step: 25000 },
                          { till: 1000000, step: 50000 },
                          { till: 2000000, step: 100000 },
                          { till: 10000000, step: 500000 }
                        ]}
                        onChange={handleSearch}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <a className={props.btnClass} href={props.url}>
                  {props.buttonText}
                </a>
              </CardBody>
            </Card>
          </Container>
        </div>
      </div>
    </>
  );
}

export default HomeHeroWithSearch;

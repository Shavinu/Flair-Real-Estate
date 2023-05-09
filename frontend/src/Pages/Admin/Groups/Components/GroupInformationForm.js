import { useEffect, useState } from "react";
import { Alert, Col, Row } from "../../../../Components";
import { Group, Input, Label, Select } from "../../../../Components/Form";
import * as GroupService from "../../../../Services/GroupService";

const GroupInformationForm = ({ group, setGroup, alert, errors }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    GroupService.getGroupList()
      .then(response => setGroups(response));
  }, []);

  return <>
    {alert &&
      <Alert type="danger" message={alert} icon={<i className="feather icon-info mr-1 align-middle"></i>} />
    }
    <Row>
      <Col sm={12} md={6}>
        <Group>
          <Label>Name (*)</Label>
          <Input name="name"
            value={group?.groupName}
            placeholder="Group Name"
            onChange={(e) => {
              setGroup({ ...group, groupName: e.target.value });
            }}
            error={errors?.groupName}
          />
        </Group>
      </Col>
      <Col sm={12} md={6}>
        <Group>
          <Label>Email (*)</Label>
          <Input name="email"
            value={group?.groupEmail}
            placeholder="Email"
            onChange={(e) => {
              setGroup({ ...group, groupEmail: e.target.value });
            }}
            error={errors?.groupEmail}
          />
        </Group>
      </Col>
      <Col sm={12} md={6}>
        <Group>
          <Label>Contact</Label>
          <Input name="contact"
            value={group?.groupContact}
            placeholder="Contact"
            onChange={(e) => {
              setGroup({ ...group, groupContact: e.target.value });
            }}
            error={errors?.contact}
          />
        </Group>
      </Col>
      <Col sm={12} md={6}>
        <Group>
          <Label>Area (*)</Label>
          <Input name="area"
            value={group?.groupArea}
            placeholder="Area"
            onChange={(e) => {
              setGroup({ ...group, groupArea: e.target.value });
            }}
            error={errors?.groupArea}
          />
        </Group>
      </Col>
      <Col sm={12} md={6}>
        <Group>
          <Label>License (*)</Label>
          <Input name="license"
            value={group?.groupLicence}
            placeholder="License"
            onChange={(e) => {
              setGroup({ ...group, groupArea: e.target.value });
            }}
            error={errors?.groupLicence}
          />
        </Group>
      </Col>
      <Col sm={12} md={6}>
        <Group>
          <Label>Type (*)</Label>
          <Select
            options={[
              { value: 'builder', label: 'Builder' },
              { value: 'agency', label: 'Agency' },
            ]}
            value={group?.groupType}
            onChange={(value) => setGroup({ ...group, groupArea: value })}
            error={errors?.groupType}
          />
        </Group>
      </Col>

      <Col sm={12} md={6}>
        <Group>
          <Label>Group</Label>
          <Select
            options={groups.map(group => ({ value: group._id, label: group.groupName }))}
            value={group?.groupParentId}
            onChange={(value) => setGroup({ ...group, groupParentId: value })}
          />
        </Group>
      </Col>
    </Row>
  </>
}

export default GroupInformationForm;

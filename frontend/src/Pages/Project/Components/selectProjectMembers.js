import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import * as UserService from '../../../Services/UserService'
import * as GroupService from '../../../Services/GroupService'

const SelectProjectMembers = ({ user, onSubmitEditableBy }) => {
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [allowGroupEdit, setAllowGroupEdit] = useState(true);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([{ value: 'all', label: 'All members' }]);
  const [subgroups, setSubgroups] = useState([]);
  const [subgroupMembers, setSubgroupMembers] = useState([]);
  const [allowSubgroupEdit, setAllowSubgroupEdit] = useState(false);
  const [selectedSubgroups, setSelectedSubgroups] = useState([]);
  const [selectedSubgroupMembers, setSelectedSubgroupMembers] = useState([{ value: 'all', label: 'All members' }]);

  const getEditableBy = () => {
    let editableBy = [];

    if (groupId) {
      if (allowGroupEdit && selectedGroupMembers.length > 0) {
        const group = {
          group: groupId,
          includeAllGroupMembers: false,
          groupMembers: [],
          includeSubGroups: false,
          subgroups: []
        };
        if (selectedGroupMembers.some(member => member.value === 'all')) {
          group.includeAllGroupMembers = true;
        } else {
          group.groupMembers.push(...selectedGroupMembers.map(member => member.value));
        }

        if (allowSubgroupEdit && (selectedSubgroups.length > 0 || selectedSubgroupMembers.some(member => member.value === 'all'))) {
          group.includeSubGroups = true;
          for (const subgroup of selectedSubgroups) {
            const subgroupMembers = selectedSubgroupMembers
              .filter(member => member.group === subgroup.value)
              .map(member => member.value);

            // Only add the subgroup to the form data if it has at least one member selected
            if (subgroupMembers.length > 0 || selectedSubgroupMembers.some(member => member.value === 'all')) {
              const subgroupObj = {
                subgroup: subgroup.value,
                includeAllSubgroupMembers: selectedSubgroupMembers.some(member => member.value === 'all'),
                subgroupMembers: subgroupMembers
              };
              group.subgroups.push(subgroupObj);
            }
          }
        }
        editableBy.push(group);
      }
    }

    return editableBy;
  };

  useEffect(() => {
    onSubmitEditableBy(getEditableBy);
  }, [onSubmitEditableBy, groupId, allowGroupEdit, selectedGroupMembers, allowSubgroupEdit, selectedSubgroups, selectedSubgroupMembers]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //get user's details
        const userDetails = await UserService.getUserDetailById(user);
        console.log(userDetails);

        //if userDetails.group does not exist return
        if (!userDetails.group) return;
        setGroupId(userDetails.group);

        // Fetch the users in the group
        const users = await GroupService.getUsersByGroupId(userDetails.group);

        const options = users.map(user => ({
          value: user._id,
          label: `${user.firstName} ${user.lastName}`
        }));

        // Fetch the subgroups in the group
        const fetchedSubgroups = await GroupService.getSubGroupsByParentGroupId(userDetails.group);

        const subgroups = fetchedSubgroups.map(subgroup => ({
          value: subgroup._id,
          label: subgroup.groupName
        }));

        // Add an "All" option
        options.unshift({ value: 'all', label: 'All members' });
        setGroupMembers(options);

        setSubgroups(subgroups);
        // setSelectedSubgroups(subgroups);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleGroupMemberChange = (newSelectedGroupMembers) => {
    // If 'All' is already selected, and newSelectedGroupMembers has other options, remove 'All'
    if (selectedGroupMembers.some(member => member.value === 'all') && newSelectedGroupMembers.length > 1) {
      newSelectedGroupMembers = newSelectedGroupMembers.filter(member => member.value !== 'all');
    }

    // If 'All' is not selected, and user selects 'All', remove all other options
    if (!selectedGroupMembers.some(member => member.value === 'all') && newSelectedGroupMembers.some(member => member.value === 'all')) {
      newSelectedGroupMembers = [{ value: 'all', label: 'All members' }];
    }

    //If newSelectedGroupMembers is empty, add 'All' option
    if (newSelectedGroupMembers.length === 0) {
      newSelectedGroupMembers = [{ value: 'all', label: 'All members' }];
    }

    setSelectedGroupMembers(newSelectedGroupMembers);
  };


  const handleSubgroupChange = async (newSelectedSubgroups) => {
    try {
      const fetchedSubgroupMembers = [];
      for (const subgroup of newSelectedSubgroups) {
        const users = await GroupService.getUsersByGroupId(subgroup.value);
        fetchedSubgroupMembers.push(...users);
      }
      console.log(fetchedSubgroupMembers);

      const options = fetchedSubgroupMembers.map(user => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`,
        group: user.group
      }));
      options.unshift({ value: 'all', label: 'All members' });
      setSubgroupMembers(options);

      // If a subgroup has been removed, remove its members from selectedSubgroupMembers
      setSelectedSubgroupMembers(prevMembers => prevMembers.filter(member =>
        // Only keep members that are in the newSelectedSubgroups
        newSelectedSubgroups.some(newSubgroup => newSubgroup.value === member.group)
      ));

      if (newSelectedSubgroups.length === 0) {
        setSelectedSubgroupMembers([]);
        setAllowSubgroupEdit(false);

      }

      // Update selected subgroups
      setSelectedSubgroups(newSelectedSubgroups);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubGroupMemberChange = (newSelectedSubgroupMembers) => {
    // If 'All' is already selected, and newSelectedSubgroupMembers has other options, remove 'All'
    if (selectedSubgroupMembers.some(member => member.value === 'all') && newSelectedSubgroupMembers.length > 1) {
      newSelectedSubgroupMembers = newSelectedSubgroupMembers.filter(member => member.value !== 'all');
    }

    // If 'All' is not selected, and user selects 'All', remove all other options
    if (!selectedSubgroupMembers.some(member => member.value === 'all') && newSelectedSubgroupMembers.some(member => member.value === 'all')) {
      newSelectedSubgroupMembers = [{ value: 'all', label: 'All members' }];
    }

    //If newSelectedSubgroupMembers is empty, add 'All' option
    if (newSelectedSubgroupMembers.length === 0) {
      newSelectedSubgroupMembers = [{ value: 'all', label: 'All members' }];
    }


    // // If 'All' is not selected in the newSelectedSubgroupMembers
    // if (!newSelectedSubgroupMembers.some(member => member.value === 'all')) {
    //   // Remove subgroups that have no members selected
    //   setSelectedSubgroups(prevSubgroups =>
    //     prevSubgroups.filter(subgroup =>
    //       newSelectedSubgroupMembers.some(member => member.group === subgroup.value)
    //     )
    //   );
    // }

    setSelectedSubgroupMembers(newSelectedSubgroupMembers);
  };


  if (groupId === null) {
    return <p>You're not part of any groups.</p>;
  }

  return (
    <div>
      <Form.Check className='mt-1 mb-1'
        type="switch"
        id={`group-checkbox`}
        label={"Allow your group members to edit project"}
        checked={allowGroupEdit}
        onChange={() => setAllowGroupEdit(!allowGroupEdit)}
      />
      <Select
        options={groupMembers}
        isMulti
        value={selectedGroupMembers}
        placeholder="Select Group Members..."
        onChange={handleGroupMemberChange}
        isDisabled={!allowGroupEdit}
      />
      {subgroups.length > 0 && (
        <div>
          <Form.Check className='mt-2 mb-1'
            type="switch"
            id={`subgroup-checkbox`}
            label={"Allow subgroups to edit project"}
            checked={allowSubgroupEdit}
            onChange={() => setAllowSubgroupEdit(!allowSubgroupEdit)}
          />
          <Select
            options={subgroups}
            isMulti
            value={selectedSubgroups}
            placeholder="Select Subgroups..."
            isDisabled={!allowSubgroupEdit}
            onChange={handleSubgroupChange}
          />
          {allowSubgroupEdit && subgroupMembers.length > 1 && (
            <Select
              options={subgroupMembers}
              value={selectedSubgroupMembers}
              isMulti
              placeholder="Select Sub Group(s) Members..."
              onChange={handleSubGroupMemberChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SelectProjectMembers;
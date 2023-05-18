import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as UserService from '../../../Services/UserService'
import * as GroupService from '../../../Services/GroupService'

const SelectEditableByGroups = ({ user }) => {
  const [options, setOptions] = useState([]);
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        //get user's group id if exists
        const userDetails = await UserService.getUserDetailById(user);
        console.log(userDetails);

        //if userDetails.group does not exist return
        if (!userDetails.group) return;

        // Fetch the user group details
        const parentGroup = await GroupService.getGroupDetailById(userDetails.group);
        setGroupId(parentGroup._id);

        // Fetch the subgroups if parentGroup.groupParentId is null
        if (!parentGroup.groupParentId) {
          const subGroups = await GroupService.getSubGroupsByParentGroupId(userDetails.group);

          const options = [
            { value: parentGroup._id, label: parentGroup.groupName },
            ...subGroups.map(group => ({ value: group._id, label: group.groupName }))
          ];
          setOptions(options);
        } else {
          const options = [
            { value: parentGroup._id, label: parentGroup.groupName }
          ];
          setOptions(options);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, [user]);

  if (options.length === 0) {
    return <p>You're not part of any groups.</p>;
  }

  return (
    <Select
      options={options}
      isMulti
      placeholder="Select Editable Groups..."
    //   value={options.filter(option => option.value === groupId)}
    />
  );
};

export default SelectEditableByGroups;

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { PROJECT_NAME } from 'src/config-global'

const ProjectCreate = () => {
  return (
    <>
      <Helmet>
        <title>Project Create | {PROJECT_NAME}</title>
      </Helmet>
    </>
  )
}

export default ProjectCreate

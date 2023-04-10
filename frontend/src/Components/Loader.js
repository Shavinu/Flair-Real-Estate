import React from 'react'

interface LoaderProps {
  size?: '2x' | '3x' | '4x';
}

const Loader: React.FunctionComponent<LoaderProps> = (props) => {
  return <React.Fragment>
    <i className={`fa ${props.size ? `fa-${props.size}` : ''} fa-cog fa-spin`}></i>
  </React.Fragment>
}

export default Loader

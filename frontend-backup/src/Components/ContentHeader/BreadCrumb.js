import React from 'react'
import { Link } from 'react-router-dom';
import utils from '../../Utils';

export interface BreadcrumbItemProps {
  name: any;
  link?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
}

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = (props) => {
  const {
    items = []
  } = props;

  return <React.Fragment>
    <div className="breadcrumb-wrapper col-12">
      <ol className="breadcrumb">
        {items && items.map(item => {
          if (!item.active) {
            return <li className="breadcrumb-item" key={utils.newGuid()}>
              <Link to={item.link ?? '/'}>{item.name}</Link>
            </li>
          }

          return <li className="breadcrumb-item active" key={utils.newGuid()}>
            {item.name}
          </li>
        })}
      </ol>
    </div>
  </React.Fragment>
}

export default Breadcrumb;

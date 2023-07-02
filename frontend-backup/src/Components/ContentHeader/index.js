import React from 'react';
import Breadcrumb, { BreadcrumbItemProps } from './BreadCrumb';

interface ContentHeaderProps {
  headerTitle: any;
  breadcrumb: BreadcrumbItemProps[];
  options?: React.ReactNode;
}

const ContentHeader: React.FunctionComponent<ContentHeaderProps> = (props) => {
  const {
    headerTitle,
    breadcrumb,
    options
  } = props;

  return <>
    <div className="content-header row">
      <div className="content-header-left col-md-9 col-12 mb-2">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            <h2 className="content-header-title float-left mb-0">{headerTitle ?? ''}</h2>
            <Breadcrumb items={breadcrumb} />
          </div>
        </div>
      </div>
      <div className="content-header-right text-md-right col-md-3 col-12 d-md-block d-none">
        <div className="form-group breadcrum-right">
          {options}
        </div>
      </div>
    </div>
  </>
}

export default ContentHeader;

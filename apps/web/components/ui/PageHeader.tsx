import React, { memo } from 'react';

interface PageHeaderProps {
  title:       string;
  description?: string;
  actions?:    React.ReactNode;
  badge?:      React.ReactNode;
}

function PageHeader({ title, description, actions, badge }: PageHeaderProps) {
  return (
    <div className="section-header">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h1 className="page-title">{title}</h1>
          {badge}
        </div>
        {description && <p className="page-subtitle">{description}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}

export default memo(PageHeader);

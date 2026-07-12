import React, { memo } from 'react';

interface InfoSectionProps {
  title:    string;
  children: React.ReactNode;
  accentColor?: string;
}

function InfoSection({ title, children, accentColor = 'text-accent-purple-mid' }: InfoSectionProps) {
  return (
    <div className="card p-4 space-y-0">
      <h4 className={`label-xs mb-3 ${accentColor}`}>{title}</h4>
      {children}
    </div>
  );
}

export default memo(InfoSection);

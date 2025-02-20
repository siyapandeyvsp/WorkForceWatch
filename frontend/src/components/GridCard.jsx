import React from 'react';
import { Card } from '@mantine/core';

const GridCard = ({ children, shadow = 'md', padding = 'xl', radius = 'md', style = {} }) => {
  const defaultStyle = {
    backgroundColor: '#f8fbff',
    border: '1px solid #dce6f1',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    height: '100%',
    ...style,
  };

  return (
    <Card shadow={shadow} padding={padding} radius={radius} style={defaultStyle}>
      {children}
    </Card>
  );
};

export default GridCard;

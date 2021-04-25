import React from 'react';
import { ResizableBox } from 'react-resizable';
import './resizable.css';

interface ResizableProps {
  direction: 'x' | 'y';
  height: number;
}

const Resizable: React.FC<ResizableProps> = ({
  direction,
  height,
  children,
}) => {
  return (
    <ResizableBox
      height={height}
      width={Infinity}
      resizeHandles={['s']}
      maxConstraints={[Infinity, window.innerHeight * 0.75]}
      minConstraints={[Infinity, 100]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;

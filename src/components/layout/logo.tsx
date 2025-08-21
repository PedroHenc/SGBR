import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.211 25.1387H24.9653L18.4981 3.5H13.565L7.1084 25.1387H11.8627L12.7937 22.3168H19.2801L20.211 25.1387ZM13.8291 19.4949L16.0317 11.4116L18.2452 19.4949H13.8291Z"
        fill="#F9842C"
      />
      <path d="M4 12.1333H24V14H4V12.1333Z" fill="#00833D" />
      <path d="M4 14.9333H24V16.8H4V14.9333Z" fill="#00833D" />
      <path d="M4 9.33325H24V11.1999H4V9.33325Z" fill="#00833D" />
    </svg>
  );
}

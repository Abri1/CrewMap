import React from 'react';

export const DotMarkerIcon = (color: string, isSelected: boolean) => {
    const size = 18;
    const style = `
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        box-shadow: 0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.4);
        border: ${isSelected ? '3px solid white' : 'none'};
    `;
    return `<div style="${style}"></div>`;
};


export const HarvesterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" {...props}>
    <path d="M54.9,31.5c-2.4,0-4.3,1.9-4.3,4.3s1.9,4.3,4.3,4.3s4.3-1.9,4.3-4.3S57.3,31.5,54.9,31.5z M54.9,37.1c-0.7,0-1.3-0.6-1.3-1.3 c0-0.7,0.6-1.3,1.3-1.3s1.3,0.6,1.3,1.3C56.2,36.5,55.6,37.1,54.9,37.1z"/>
    <path d="M28.4,31.5c-2.4,0-4.3,1.9-4.3,4.3s1.9,4.3,4.3,4.3s4.3-1.9,4.3-4.3S30.8,31.5,28.4,31.5z M28.4,37.1c-0.7,0-1.3-0.6-1.3-1.3 c0-0.7,0.6-1.3,1.3-1.3s1.3,0.6,1.3,1.3C29.7,36.5,29.1,37.1,28.4,37.1z"/>
    <path d="M49,34.2v-5.4c0-2.3-1.4-4.4-3.6-5.3L34.1,18c-0.6-0.2-1.2-0.2-1.8,0l-3.3,1.4c-0.5,0.2-0.8,0.7-0.8,1.2v3.7h-3.4 c-2.3,0-4.4,1.4-5.3,3.6L17,35.1c-0.2,0.6-0.2,1.2,0,1.8l1.4,3.3c0.2,0.5,0.7,0.8,1.2,0.8h1.1v-6.5c0-1.3,1.1-2.4,2.4-2.4h30.1 c0.5,0,0.9-0.4,0.9-0.9V29C53.7,28.7,51.8,28.2,49,34.2z M45.8,25.8c0.6,0,1.1,0.5,1.1,1.1c0,0.6-0.5,1.1-1.1,1.1s-1.1-0.5-1.1-1.1 C44.7,26.3,45.2,25.8,45.8,25.8z"/>
  </svg>
);


export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.226A6.668 6.668 0 0 0 18 15.72M6.244 16.072a4.5 4.5 0 0 1-1.244-.923 4.5 4.5 0 0 1-1.244-6.305 4.5 4.5 0 0 1 6.305-1.244 4.5 4.5 0 0 1 1.244 6.305M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

export const RecenterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12 21a8.25 8.25 0 1 0 0-16.5 8.25 8.25 0 0 0 0 16.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3.75m11.25 0H21m-9-9v3.75m0 11.25V21" />
  </svg>
);

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 3a9 9 0 1 1-6.364 2.636" />
    </svg>
);

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375-3.375-3.375M14.25 14.25l-3.375 3.375" />
    </svg>
);

export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const ShareIosIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
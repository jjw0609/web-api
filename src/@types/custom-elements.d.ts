import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'shadow-child': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react';

  interface ResponsiveMasonryProps {
    children: ReactNode;
    columnsCountBreakPoints?: Record<number, number>;
  }

  interface MasonryProps {
    children: ReactNode;
    gutter?: string;
    className?: string;
  }

  export function ResponsiveMasonry(props: ResponsiveMasonryProps): JSX.Element;
  export default function Masonry(props: MasonryProps): JSX.Element;
}
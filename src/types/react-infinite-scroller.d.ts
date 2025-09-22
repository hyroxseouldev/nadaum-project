declare module 'react-infinite-scroller' {
  import { ReactNode, Component } from 'react';

  interface InfiniteScrollProps {
    pageStart?: number;
    loadMore: (page: number) => void;
    hasMore: boolean;
    loader?: ReactNode;
    threshold?: number;
    useWindow?: boolean;
    isReverse?: boolean;
    useCapture?: boolean;
    getScrollParent?: () => HTMLElement | null;
    className?: string;
    element?: string;
    children?: ReactNode;
  }

  export default class InfiniteScroll extends Component<InfiniteScrollProps> {}
}
import type {ReactNode} from 'react';
import DocsChat from '@site/src/components/DocsChat';

/** Wraps every page so the docs chat is available across the whole site. */
export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      {children}
      <DocsChat />
    </>
  );
}

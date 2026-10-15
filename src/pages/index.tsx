import type {ReactNode} from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

// The documentation starts at "What is HospedaPlus".
export default function Home(): ReactNode {
  return <Redirect to={useBaseUrl('/docs/what-is-hospedaplus')} />;
}

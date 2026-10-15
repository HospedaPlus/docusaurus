import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Swizzled (ejected) to show the word "Home" instead of the house icon.
export default function HomeBreadcrumbItem(): ReactNode {
  const homeHref = useBaseUrl('/');

  return (
    <li className="breadcrumbs__item">
      <Link className="breadcrumbs__link" href={homeHref}>
        Home
      </Link>
    </li>
  );
}

import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Booking from '@site/src/components/Booking';
import {bookingStrings} from '@site/src/components/Booking/strings';

export default function BookingPage(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const s = bookingStrings[i18n.currentLocale] ?? bookingStrings.en;
  return (
    <Layout title={s.pageTitle} description={s.pageDescription}>
      <Booking />
    </Layout>
  );
}

// pages/_app.tsx
import '../styles/globals.css'; // Tailwind 설정된 전역 CSS 파일

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

import React from 'react';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import { StoreProvider } from '../store/StoreContext';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from '../config/web3/library.config';
import getStore from '../store/stores';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function WizardWorkshop({ Component, pageProps }: AppProps): JSX.Element {
  const store = getStore();
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <meta key="twitter:card" name="twitter:card" content="app" />
        <meta
          key="twitter:title"
          name="twitter:title"
          content="Wizards Guide"
        />
        <meta
          key="twitter:url"
          name="twitter:url"
          content="https://wizards-viewer.vercel.app/"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="A hidden library lost in time. 10,000 on-chain wizards chronicled by Chronomancers. Enter the Nightmare Paradise."
        />
        <meta
          key="twitter:image"
          name="twitter:image"
          content="https://portal.forgottenrunes.com/api/souls/img/2527"
        />
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content="@axejintao"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:site_name"
          property="og:site_name"
          content="Wizards Guide"
        />
        <meta
          key="og:url"
          property="og:url"
          content="https://art-bridge-ui.vercel.app/"
        />
        <meta
          key="og:image"
          property="og:image"
          content="https://wizards-viewer.vercel.app/"
        />
        <meta
          key="og:description"
          property="og:description"
          content="A hidden library lost in time. 10,000 on-chain wizards chronicled by Chronomancers. Enter the Nightmare Paradise."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=New+Rocker&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <StoreProvider value={store}>
          <div className="flex flex-grow">
            <Sidebar />
            <div className="flex flex-col flex-grow max-h-screen w-5/6">
              <Header />
              <div className="overflow-auto flex flex-grow">
                <Component {...pageProps} />
              </div>
            </div>
            <ToastContainer
              position="bottom-right"
              newestOnTop={true}
              closeOnClick
              theme="dark"
              draggable
            />
          </div>
        </StoreProvider>
      </Web3ReactProvider>
    </div>
  );
}

WizardWorkshop.getInitialProps = async (context: AppContext) => {
  const store = getStore();
  context.ctx['mobx'] = store;

  const appProps = await App.getInitialProps(context);
  return {
    ...appProps,
  };
};

export default WizardWorkshop;

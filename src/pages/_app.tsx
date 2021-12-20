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
        {/*
        <meta key="twitter:card" name="twitter:card" content="app" />
        <meta key="twitter:title" name="twitter:title" content="Art Bridge" />
        <meta
          key="twitter:url"
          name="twitter:url"
          content="https://art-bridge-ui.vercel.app/"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Art Bridge aims to bridge the gap between Traditional Art and NFTs by guiding artists and creators on their journey to the digital domain."
        />
        <meta
          key="twitter:image"
          name="twitter:image"
          content="https://art-bridge-og.s3.us-west-2.amazonaws.com/logo.png"
        />
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content="@ArtBridge_io"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="Art Bridge" />
        <meta
          key="og:url"
          property="og:url"
          content="https://art-bridge-ui.vercel.app/"
        />
        <meta
          key="og:image"
          property="og:image"
          content="https://art-bridge-og.s3.us-west-2.amazonaws.com/logo.png"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Art Bridge aims to bridge the gap between Traditional Art and NFTs by guiding artists and creators on their journey to the digital domain."
        /> */}
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
            <div className="flex flex-col flex-grow">
              <Header />
              <Component {...pageProps} />
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

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';
import LoadingScreen from '../components/LoadingScreen';

function MyApp(props) {
    const { Component, pageProps } = props;

    const router = useRouter();
    /* Loading Screen */
    const [pageLoading, setPageLoading] = React.useState(false);
    React.useEffect(() => {
        const handleStart = () => { setPageLoading(true); }
        const handleComplete = () => { setPageLoading(false); };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
    }, [router]);

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            {
                pageLoading ? (
                    <LoadingScreen />
                ) : (
                    <React.Fragment>
                        <Head>
                            <title>Real Estate Management System</title>
                            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                        </Head>
                        <ThemeProvider theme={theme}>
                            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                            <CssBaseline />
                            <Component {...pageProps} />
                        </ThemeProvider>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

export default MyApp;
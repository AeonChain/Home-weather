import '../styles/global.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
	return (<div className="grid h-screen w-screen bg-gradient-to-b from-teal-600 via-teal-900 to-slate-900"><Component {...pageProps} /></div>);
}
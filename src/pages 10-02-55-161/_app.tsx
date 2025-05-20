// import type { NextPage } from 'next' 
// import type { AppProps } from 'next/app'

// type ExtendedAppProps = AppProps & {
//     Component: NextPage
// }

export default function App() {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )

}
import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react';

interface LoadingProps extends React.ComponentProps<typeof Spinner>{}

export default function Loading(props: LoadingProps): React.JSX.Element {
    return (
        <Spinner {...props} />
    );
}
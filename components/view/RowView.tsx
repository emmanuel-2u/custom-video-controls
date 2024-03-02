import React from 'react';
import { View, StyleSheet } from 'react-native';

interface RowViewProps extends React.ComponentProps<typeof View>{}

export default function RowView(props: RowViewProps): React.JSX.Element {
    const { style, ...otherProps } = props;
    return (
        <View style={[styles.view, style]} {...otherProps}></View>
    );
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    }
});
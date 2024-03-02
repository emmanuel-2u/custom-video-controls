import React from 'react';
import { StyleSheet, Text } from 'react-native';

import type { ButtonProps } from './Button.tsx';
import Button from './Button';

interface TextButtonProps extends ButtonProps {
    text: string,
    textColor: string
}

export default function TextButton(props: TextButtonProps): React.JSX.Element {
    const { text, textColor, ...otherProps } = props;

    return (
        <Button {...otherProps}>
            <Text style={[styles.text, { color: textColor }]}>
                {text}
            </Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        fontSize: 19
    }
});
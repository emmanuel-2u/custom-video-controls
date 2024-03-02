import { Pressable } from 'react-native';
import React from 'react';

interface ButtonProps extends React.ComponentProps<typeof Pressable>{}

export type { ButtonProps };

export default function Button(props: ButtonProps): React.JSX.Element {
    return (
        <Pressable {...props}></Pressable>
    );
}
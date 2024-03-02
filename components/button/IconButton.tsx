import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';

import Button from './Button';
import type { ButtonProps } from './Button';

interface IconButtonProps extends ButtonProps {
    materialIconName?: keyof typeof MaterialCommunityIcons.glyphMap,
    antIconName?: keyof typeof AntDesign.glyphMap,
    isMaterialIcon: boolean,
    iconSize?: number
}

export default function IconButton(props: IconButtonProps): React.JSX.Element {
    const {
        materialIconName,
        isMaterialIcon,
        iconSize,
        antIconName,
        ...otherProps
    } = props;

    if (isMaterialIcon) {
        return (
            <Button {...otherProps}>
                <MaterialCommunityIcons
                    name={materialIconName}
                    size={iconSize}
                    color='white'
                />
            </Button>
        );
    }
    return (
        <Button {...otherProps}>
            <AntDesign
                name={antIconName}
                size={iconSize || 40}
                color='white'
            />
        </Button>
    )
}
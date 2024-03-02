import { View, StyleSheet } from 'react-native';
import React from 'react';
import Animated, { SharedValue } from 'react-native-reanimated';

import IconButton from '../button/IconButton';

interface VolumeControlProps extends React.ComponentProps<typeof View> {
    volumeHeight: SharedValue<number>
    onInnerVolumeLayout: (height: number) => void
}

export default function VolumeControl(props: VolumeControlProps): React.JSX.Element {
    const { volumeHeight, onInnerVolumeLayout } = props;

    return (
        <View style={[
            styles.containerStyle
        ]}>
            <View
                style={[
                    styles.outerVolumeView
                ]}
                onLayout={event => {
                    onInnerVolumeLayout(event.nativeEvent.layout.height)
                }}>
                <Animated.View
                    style={[
                        styles.innerVolumeView,
                        { height: volumeHeight }
                    ]}>
                </Animated.View>
            </View>
            <View>
                <IconButton
                    isMaterialIcon={false}
                    antIconName='sound'
                    iconSize={15}
                    style={{ alignItems: 'center' }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'rgba(52, 52, 52, 0.4)',
        borderRadius: 5,
        padding: 5,
        flexGrow: 1,
        marginVertical: 5,
        width: 30,
        alignSelf: 'flex-end'
    },
    outerVolumeView: {
        backgroundColor: '#C4C4C4',
        width: 7,
        alignSelf: 'center',
        margin: 1,
        borderRadius: 7,
        flexGrow: 1
    },
    innerVolumeView: {
        backgroundColor: 'white',
        borderRadius: 7
    }
});
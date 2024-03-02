import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { SharedValue } from 'react-native-reanimated';

import VolumeControl from '../video/VolumeControl';
import IconButton from '../button/IconButton';
import RowView from '../view/RowView';

import { formatTime } from '../../utils/time';

interface VideoControlsProps {
    containerHeight: number
    totalTimeMilli: number
    currentTimeMilli: number
    isPlaying: boolean
    isMuted: boolean
    isFullScreen: boolean
    onMute: () => void
    onDrag: (value: number) => void
    onPlayPause: () => void
    onFullscreen: () => void
    onLayout: (height: number) => void
    unloadVideo: () => void
    volumeHeight: SharedValue<number>
}

export default function VideoControls(props: VideoControlsProps): React.JSX.Element {
    const {
        totalTimeMilli,
        currentTimeMilli,
        isPlaying,
        onPlayPause,
        isMuted,
        isFullScreen,
        containerHeight,
        onMute,
        onDrag,
        onFullscreen,
        onLayout,
        unloadVideo,
        volumeHeight
    } = props;

    const currentTime = formatTime(currentTimeMilli);
    const totalTime = formatTime(totalTimeMilli);

    return (
        <View style={[styles.container, { height: containerHeight }]}>
            <View
                style={styles.topControl}>
                <IconButton
                    isMaterialIcon={false}
                    antIconName='closecircleo'
                    iconSize={34}
                    onPress={unloadVideo}
                />
            </View>
            <VolumeControl
                volumeHeight={volumeHeight}
                onInnerVolumeLayout={onLayout}
            />
            <View style={styles.bottomControl}>
                <RowView>
                    <Text style={styles.timeStatus}>{currentTime}</Text>
                    <Slider
                        style={{ flex: 1 }}
                        minimumValue={0}
                        maximumValue={totalTimeMilli}
                        minimumTrackTintColor='white'
                        maximumTrackTintColor='blue'
                        value={currentTimeMilli}
                        onValueChange={onDrag}
                        onSlidingComplete={onDrag}
                    />
                    <Text style={styles.timeStatus}>{totalTime}</Text>
                </RowView>
                <RowView style={{
                    justifyContent: 'space-evenly', width: '100%'
                }}>
                    <IconButton
                        isMaterialIcon={!isMuted}
                        onPress={onMute}
                        materialIconName='volume-mute'
                        antIconName='sound'
                        iconSize={30}
                    />
                    <IconButton
                        isMaterialIcon={false}
                        onPress={onPlayPause}
                        antIconName={isPlaying ? 'pausecircleo' : 'playcircleo'}
                    />
                    <IconButton
                        isMaterialIcon={true}
                        onPress={onFullscreen}
                        iconSize={30}
                        materialIconName={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                    />
                </RowView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    timeStatus: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: 'white'
    },
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        justifyContent: 'space-between'
    },
    bottomControl: {
        backgroundColor: 'rgba(52, 52, 52, 0.4)'
    },
    topControl: {
        backgroundColor: 'rgba(52, 52, 52, 0.4)',
        borderRadius: 15,
        alignSelf: 'flex-end'
    }
});
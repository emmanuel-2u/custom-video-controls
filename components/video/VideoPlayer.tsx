import { Video, ResizeMode } from 'expo-av';
import React, { forwardRef } from 'react';
import { Pressable } from 'react-native';

interface VideoProps extends React.ComponentProps<typeof Video> {
    videoSource: string
    onVideoClicked: () => void
}

export default forwardRef(VideoPlayer);

function VideoPlayer(props: VideoProps, ref: any): React.JSX.Element {
    const { videoSource, onVideoClicked, ...otherProps } = props;

    return (
        <Pressable onPress={onVideoClicked}>
            <Video
                resizeMode={ResizeMode.CONTAIN}
                source={{ uri: videoSource }}
                ref={ref}
                {...otherProps}
            />
        </Pressable>
    );
}
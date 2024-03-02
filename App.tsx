import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    View,
    ImageBackground,
    ImageSourcePropType,
    useWindowDimensions,
    Alert,
    Text
} from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAssets } from 'expo-asset';
import Constants from 'expo-constants';
import { AVPlaybackStatusSuccess } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { interpolate, useSharedValue } from 'react-native-reanimated';
import {
    GestureHandlerRootView, Gesture, GestureDetector
} from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

import TextButton from './components/button/TextButton';
import VideoPlayer from './components/video/VideoPlayer';
import VideoControls from './components/video/VideoControls';
import Loading from './components/loading/Loading';
import RowView from './components/view/RowView';

import { calculateHeight } from './utils/height-calc';

const testVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

interface VideoSize {
    width: number
    height: number
}

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [source, setSource] = useState<string | null>(null);
    const [showControls, setShowControls] = useState(true);
    const [playing, setPlaying] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(900);
    const [videoSize, setVideoSize] = useState<VideoSize | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [calculatedVolumeHeight, setCalculatedVolumeHeight] = useState(0);

    const videoRef = useRef<any>(null);
    const totalDuration = useRef<number | null>(null);
    const startingY = useRef(0);
    const currentY = useRef(0);

    const [fontsLoaded, fontsError] = useFonts({
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf')
    });
    const [assets, error] = useAssets([require('./assets/luca.png')]);
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const volume = useSharedValue(50);

    const selectVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
            allowsEditing: false
        });

        if (result.canceled) {
            Alert.alert('Error occured', 'You must select a video');
            return null;
        }
        return result.assets[0].uri;
    }

    const callOnViewLayout = useCallback(async () => {
        if (fontsLoaded || fontsError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontsError]);

    if ((!fontsError && !fontsLoaded) || error || !assets) {
        return null;
    }

    const onPlayPause = () => {
        if (playing) {
            return setPlaying(false);
        }
        return setPlaying(true);
    }

    async function unloadVideo() {
        setSource(null);
        setShowControls(false);
        setPlaying(true);
        setVideoLoading(true);
        setIsMuted(false);
        setVideoSize(null);
        if (fullscreen) {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            setFullscreen(false);
        }
    }

    const onDrag = (value: number) => {
        const currentValue = Math.floor(value);
        if (videoRef.current) {
            videoRef?.current?.setPositionAsync(currentValue);
        }
    }

    const onFullScreenClicked = async () => {
        if (fullscreen) {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            return setFullscreen(false);
        }
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
        );
        return setFullscreen(true);
    }

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded && status.error) {
            return unloadVideo();
        }
        const statusObject = status as AVPlaybackStatusSuccess;
        if (!totalDuration.current && statusObject.durationMillis) {
            totalDuration.current = statusObject.durationMillis;
        }
        if (statusObject.didJustFinish) {
            setPlaying(false);
            setShowControls(true);
            videoRef.current.setPositionAsync(0);
        }
        setCurrentTime(statusObject.positionMillis);
    }

    const onVolumeHeightCalculated = (height: number) => {
        setCalculatedVolumeHeight(height);
    }

    const onError = async (error: string) => {
        Alert.alert('Playback error', 'An error occured while playing the video' + error);
        await unloadVideo();
    }

    const controlsCondition = source && showControls && !videoLoading;

    // I got this 40 through trial and error like videoSize.height - 40
    // which applies when video is in fullscreen
    const height = videoSize ? fullscreen ? windowHeight - 40 : calculateHeight(videoSize.height, videoSize.width, fullscreen ? windowHeight : windowWidth) : 200;

    // Setup pan gesture handler
    const gesture = Gesture.Pan()
        .shouldCancelWhenOutside(true)
        // Running on js because calling setVolumeAsync throws error
        .runOnJS(true)
        .onStart(event => {
            currentY.current = event.y;
        })
        .onChange((event) => {
            const { y } = event;
            if (y >= 0 && y <= height) {
                const interpolated = interpolate(
                    y,
                    [0, currentY.current, height],
                    [0, startingY.current, calculatedVolumeHeight]
                );
                const finalValue = Math.round(interpolated);
                volume.value = finalValue;
                const newVolume = finalValue / calculatedVolumeHeight;
                videoRef.current.setVolumeAsync(newVolume);
                if (newVolume === 0 && !isMuted) {
                    setIsMuted(true);
                } else if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                }
            }
        })
        .onEnd(() => {
            startingY.current = volume.value;
        });

    return (
        <View onLayout={callOnViewLayout} style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
            {!fullscreen && <StatusBar style="auto" />}
            {fullscreen && <StatusBar backgroundColor={'transparent'} translucent />}
            <ImageBackground
                source={assets[0] as ImageSourcePropType}
                style={styles.imageBackground}
            >
                {!source &&
                    <View style={styles.container}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                Tested supported video file type: mp4
                            </Text>
                        </View>
                        <RowView style={styles.row}>
                            <TextButton
                                text='Select a Video'
                                style={styles.selectVideoButton}
                                textColor='white'
                                onPress={async () => {
                                    const videoSrc = await selectVideo();
                                    setSource(videoSrc);
                                }}
                            />
                            <TextButton
                                text='Big Buck Bunny'
                                style={styles.testVideoButton}
                                textColor='white'
                                onPress={() => {
                                    setSource(testVideoUrl);
                                }}
                            />
                        </RowView>
                    </View>}
                <GestureHandlerRootView>
                    <GestureDetector gesture={gesture}>
                        <View>
                            {source && <VideoPlayer
                                videoSource={source}
                                shouldPlay={playing}
                                onReadyForDisplay={({ naturalSize }) => {
                                    const { width, height } = naturalSize;
                                    setVideoSize({ width, height });
                                    setVideoLoading(false);
                                }}
                                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                                isMuted={isMuted}
                                onError={onError}
                                // @ts-ignore
                                ref={videoRef}
                                onVideoClicked={() => {
                                    setShowControls(control => !control)
                                }}
                                style={{
                                    width: windowWidth,
                                    height
                                }}
                                volume={0.5}
                            />}
                            {source && videoLoading && <Loading
                                textContent='Loading...'
                                visible={videoLoading}
                                textStyle={{ color: 'white' }}
                            />}
                        </View>
                    </GestureDetector>
                </GestureHandlerRootView>
                {controlsCondition && <VideoControls
                    totalTimeMilli={totalDuration.current || 0}
                    currentTimeMilli={currentTime}
                    isPlaying={playing}
                    onPlayPause={onPlayPause}
                    isMuted={isMuted}
                    onFullscreen={onFullScreenClicked}
                    isFullScreen={false}
                    onDrag={onDrag}
                    containerHeight={height}
                    onLayout={onVolumeHeightCalculated}
                    unloadVideo={unloadVideo}
                    volumeHeight={volume}
                    onMute={() => setIsMuted(isMuted => !isMuted)}
                />}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    row: {
        rowGap: 10
    },
    textContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        marginBottom: 20
    },
    text: {
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        color: 'white'
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover'
    },
    selectVideoButton: {
        backgroundColor: '#0026CA',
        padding: 14,
        borderRadius: 15
    },
    testVideoButton: {
        padding: 14,
        borderColor: '#7A7CFF',
        borderRadius: 15,
        borderWidth: 2
    }
});

# Simple basic video player with custom controls built using Expo

I created this basic video player based on curiosity on how video custom controls works in react native. The expo video library has controls (```useNativeControls```) but you might want to customize it. So this is basically a practice project and also playing around how to implement custom video controls in the social media app me and my people are building.

## Credits
Here are some articles that helped me:
* https://medium.com/timeless/creating-a-precision-slider-volume-interaction-part-ii-36525d200b52
* https://medium.com/@rahulchowdhury_69408/mastering-expo-video-creating-custom-video-controls-for-a-seamless-user-experience-7f63d40c967

## How to run
Here are some screenshots of the app:

To run it locally, clone the repo and run ```npm install```. Then run ```npm start```

## Problems observed
* If the video selected to play is vertical video, the video might cover the screen vertically and the bottom controls might not show
* The animation for reducing volume is a bit laggy as the gesture handler runs on the js thread
* Works well with only mp4 videos
* Selecting videos with large file size takes a while to load
* Video duration might be incorrect
* During playback or while pausing and playing video, the volume indicator is being reset
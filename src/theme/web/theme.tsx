import React, { useContext, useRef } from 'react';
import screenfull from 'screenfull';
import styles from './style.less';
import { PlayerContext } from '../../model';
import Subtitle from '../components/subtitle';
import Danmu from '../components/danmu';
import Volume from '../components/volume';
import Setting from '../components/setting';
import WebScreen from '../components/webscreen';
import FullScreen from '../components/fullscreen';
import Play from '../components/play';
import Duration from '../components/duration';
import Message from '../components/message';
import Loading from '../components/loading';
import Progress from '../components/progress';
import Information from '../components/information';

const reactComponent: React.FC<{}> = props => {
  const data = useContext(PlayerContext);
  const { methods, state } = data;
  const { webscreen, light } = state;
  const { children } = props;

  const playerRef: React.RefObject<T> = useRef(undefined);
  const infoRef: React.RefObject<T> = useRef(undefined);

  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const togglePlay = () => {
    methods.changePlay();
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(playerRef.current);
    }
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    switch (e.keyCode) {
      case 32: // space
        methods.changePlay();
        break;
      case 37: // left
        methods.changeSeeked(state.current - 15);
        infoRef.current.init('backward');
        break;
      case 38: // up
        methods.changeVolume(state.volume + 0.05);
        infoRef.current.init('volume');
        break;
      case 39: // right
        methods.changeSeeked(state.current + 15);
        infoRef.current.init('forward');
        break;
      case 40: // down
        methods.changeVolume(state.volume - 0.05);
        infoRef.current.init('volume');
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={playerRef}
      className={`${styles.qinplayer} ${webscreen && styles.webscreen} ${light && styles.nolight}`}
      tabIndex={-1}
      onKeyDown={onKeyPress}
    >
      <div className={styles.control} onClick={togglePlay}>
        <Message></Message>
        <Loading></Loading>
        <Information ref={infoRef}></Information>
        <div
          className={`${styles.bar} ${state.play ? styles.play : styles.pause}`}
          onClick={preventDefault}
        >
          <div className={styles.content}>
            <Progress></Progress>
            <div className={styles.option}>
              <div className={styles.left}>
                <Play></Play>
                <Duration></Duration>
              </div>
              <div className={styles.right}>
                <Volume></Volume>
                {state.subtitle && <Subtitle></Subtitle>}
                <Setting></Setting>
                <WebScreen></WebScreen>
                <FullScreen onChange={toggleFullscreen}></FullScreen>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default reactComponent;
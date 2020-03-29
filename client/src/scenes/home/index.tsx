import React from 'react';
import {SafeAreaView, Text, Button}  from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {HomeNavigatorParamList} from '../../navigations/home-navigator';
import BackgroundGeolocation, {
  Location,
  LocationError,
  HeartbeatEvent,
  MotionActivityEvent,
  MotionChangeEvent,
  ProviderChangeEvent,
} from 'react-native-background-geolocation';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../store';
import {addLocation, deleteLocations} from '../../store/traces/actions'

type StatusScreenNavigationProp = BottomTabNavigationProp<
  HomeNavigatorParamList,
  'Status'
>;

type MyStatusProps = {
  navigation: StatusScreenNavigationProp;
};
type StatusProps = StatusPropsFromRedux & MyStatusProps;
type StatusState = {};

export class StatusScreen extends React.Component<StatusProps, StatusState> {
  state: StatusState = {};

  constructor(props: StatusProps) {
    super(props);
    BackgroundGeolocation.onLocation(this.onLocation,
       this.onError);
    BackgroundGeolocation.onMotionChange(this.onMotionChange);
    BackgroundGeolocation.onActivityChange(this.onActivityChange);
    BackgroundGeolocation.onProviderChange(this.onProviderChange);
    BackgroundGeolocation.onHeartbeat(this.onHeartbeat);
  }

  onLocation(location: Location) {
    console.log('[location] -', location);
    // console.log(this.props)
    // this.props.addLocation(location)
  }
  onError(error: LocationError) {
    console.warn('[location] ERROR -', error);
  }
  onActivityChange(event: MotionActivityEvent) {
    console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
  }
  onProviderChange(provider: ProviderChangeEvent) {
    console.log('[providerchange] -', provider.enabled, provider.status);
  }
  onMotionChange(event: MotionChangeEvent) {
    console.log('[motionchange] -', event.isMoving, event.location);
  }
  onHeartbeat(event: HeartbeatEvent) {
    console.log('[heartbeat] -', event.location);
  }

  componentDidMount() {
    console.log('Home mounted');
    BackgroundGeolocation.ready(
      {
        distanceFilter: 10,
        stopOnTerminate: false,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        debug: false,
      },
      state => {
        console.log(
          '- BackgroundGeolocation is configured and ready: ',
          state.enabled,
        );

        if (!state.enabled) {
          BackgroundGeolocation.start(function() {
            console.log('- Start success');
          });
        }
      },
    );
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  render() {
    const {counter, incrementClick} = this.props;
    return (
      <SafeAreaView>
        <Text>Screen: Status</Text>
        <Button onPress={() => incrementClick()} title="Increment Me!" />
      </SafeAreaView>
    );
  }
}

const mapState = (state: RootState) => ({
  counter: state.counter.value,
});

// const mapDispatch = { addLocation: (location: any) => ({
//     type: 'ADD_LOCATION',
//     payload: location
//   }),
//   // deleteLocation: () => deleteLocations(),
// };

const mapDispatch = {
  incrementClick: () => ({type: 'INCREMENT'}),
};



type StatusPropsFromRedux = ConnectedProps<typeof connector>;
const connector = connect(mapState, mapDispatch);
export default connector(StatusScreen);


type AboutScreenNavigationProp = BottomTabNavigationProp<
  HomeNavigatorParamList,
  'About'
>;

type AboutPropos = {
  navigation: AboutScreenNavigationProp;
};

export const AboutScreen = ({navigation}: AboutPropos) => (
  <SafeAreaView>
    <Text>Screen: About</Text>
  </SafeAreaView>
);

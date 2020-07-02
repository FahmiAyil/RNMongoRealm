import React from 'react';
import {SafeAreaView, View, StatusBar} from 'react-native';
import {Button} from 'react-native-elements';
import {useAuth} from './AuthProvider';
import {LogInView} from './LogInView';
import {AuthProvider} from './AuthProvider';
import {TasksProvider} from './TasksProvider';
import {OfflineProvider} from './OfflineProvider';
import {TasksView} from './TasksView';

const App = () => {
  return (
    <AuthProvider>
      <AppBody />
    </AuthProvider>
  );
};

// The AppBody is the main view within the App. If a user is not logged in, it
// renders the login view. Otherwise, it renders the tasks view. It must be
// within an AuthProvider.
function AppBody() {
  const {user} = useAuth();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          {user == null ? (
            <LogInView />
          ) : (
            <OfflineProvider projectId="My Project">
              <TasksProvider projectId="My Project">
                <TasksView />
              </TasksProvider>
            </OfflineProvider>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

export default App;

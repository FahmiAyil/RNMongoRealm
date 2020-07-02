import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {useAuth} from './AuthProvider';
import {User} from './offlineSchemas';

// Create the context that will be provided to descendants of OfflineProvider via
// the useUsers hook.
const OfflineContext = React.createContext(null);
const OfflineProvider = ({children, projectId}) => {
  // Get the user from the AuthProvider context.
  const {user} = useAuth();

  const [userData, setUser] = useState({});

  // The tasks list will contain the tasks in the realm when opened.
  // This realm does not need to be a state variable, because we don't re-render
  // on changing the realm.
  const realmRef = useRef(null);
  // The effect hook replaces lifecycle methods such as componentDidMount. In
  // this effect hook, we open the realm that contains the tasks and fetch a
  // collection of tasks.
  useEffect(() => {
    // Check that the user is logged in. You must authenticate to open a synced
    // realm.
    if (user == null) {
      console.warn('TasksView must be authenticated!');
      return;
    }

    // Define the configuration for the realm to use the Task schema. Base the
    // sync configuration on the user settings and use the project ID as the
    // partition value. This will open a realm that contains all objects where
    // object._partition == projectId.
    const config = {
      schema: [User.schema],
    };

    console.log(
      `Attempting to open Realm ${projectId} for user ${
        user.identity
      } with config: ${JSON.stringify(config)}...`,
    );

    // Set this flag to true if the cleanup handler runs before the realm open
    // success handler, e.g. because the component unmounted.
    let canceled = false;

    // Now open the realm asynchronously with the given configuration.
    Realm.open(config)
      .then(openedRealm => {
        // If this request has been canceled, we should close the realm.
        if (canceled) {
          openedRealm.close();
          return;
        }

        // Update the realmRef so we can use this opened realm for writing.
        realmRef.current = openedRealm;

        // Read the collection of all Tasks in the realm. Again, thanks to our
        // configuration above, the realm only contains tasks where
        // task._partition == projectId.

        const syncTasks = openedRealm.objects('User');
        console.log('user off >', syncTasks);

        if (syncTasks.length === 0) {
          openedRealm.write(() => {
            // Create a new task in the same partition -- that is, in the same project.

            openedRealm.create(
              'User',

              new User({
                name: 'Fahmi',
              }),
            );
            openedRealm.create(
              'User',

              new User({
                name: 'Tony',
              }),
            );
            openedRealm.create(
              'User',

              new User({
                name: 'Jack',
              }),
            );
            openedRealm.create(
              'User',

              new User({
                name: 'Lisa',
              }),
            );
          });
          const data = openedRealm.objects('User');

          setUser([...data]);
        } else {
          setUser([...syncTasks]);
        }

        // Watch f
        // Set the tasks state variable and re-render.
      })
      .catch(error => console.warn('Failed to open realm:', error));

    // Return the cleanup function to be called when the component is unmounted.
    return () => {
      // Update the canceled flag shared between both this callback and the
      // realm open success callback above in case this runs first.
      canceled = true;

      // If there is an open realm, we must close it.
      const realm = realmRef.current;
      if (realm != null) {
        realm.removeAllListeners();
        realm.close();
        realmRef.current = null;
      }
    };
  }, [user, projectId]); // Declare dependencies list in the second parameter to useEffect().
  // Define our create, update, and delete functions that users of the
  // useUsers() hook can call.
  // Render the children within the TaskContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useUsers hook.

  const getUserName = param => {
    let currentUser = userData
      .filter(data => param && data._id.toString() === param.toString())
      .pop();
    return currentUser ? currentUser.name : null;
  };

  return (
    <OfflineContext.Provider
      value={{
        projectId,
        userData,
        getUserName,
      }}>
      {children}
    </OfflineContext.Provider>
  );
};

// The useUsers hook can be used by any descendant of the OfflineProvider. It
// provides the tasks of the OfflineProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useUsers = () => {
  const value = useContext(OfflineContext);
  if (value == null) {
    throw new Error('useUsers() called outside of a OfflineProvider?');
  }
  return value;
};

export {OfflineProvider, useUsers};

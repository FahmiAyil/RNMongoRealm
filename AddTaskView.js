import React, {useState, useEffect} from 'react';
import {Overlay, Input, Button} from 'react-native-elements';
import {Picker} from '@react-native-community/picker';
import {useTasks} from './TasksProvider';

// The AddTaskView is a button for adding tasks. When the button is pressed, an
// overlay shows up to request user input for the new task name. When the
// "Create" button on the overlay is pressed, the overlay closes and the new
// task is created in the realm.
export function AddTaskView() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [state, setState] = useState('');
  const [categories, setCategories] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  const {createTask, cats} = useTasks();
  useEffect(() => {
    let data = cats.map(cat => {
      cat.value = cat._id;
      return cat;
    });
    setCategories(data);
  }, [cats]);

  const categoryData = () => {
    let data = cats.filter(cat => cat._id.toString() === state).pop();
    return data;
  };

  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{width: '90%'}}
        onBackdropPress={() => setOverlayVisible(false)}>
        <>
          <Input
            placeholder="New Task Name"
            onChangeText={text => setNewTaskName(text)}
            autoFocus={true}
          />
          <Picker
            selectedValue={state}
            onValueChange={(itemValue, itemIndex) => setState(itemValue)}>
            <Picker.Item label="New" value="new" />
            {categories.map(cat => (
              <Picker.Item
                key={cat.name}
                label={cat.name}
                value={cat.value.toString()}
              />
            ))}
          </Picker>
          <Button
            title="Create"
            onPress={() => {
              setOverlayVisible(false);
              createTask(newTaskName, categoryData());
            }}
          />
        </>
      </Overlay>
      <Button
        type="outline"
        title="Add Task"
        onPress={() => {
          setOverlayVisible(true);
        }}
      />
    </>
  );
}

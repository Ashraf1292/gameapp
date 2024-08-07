import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const EditProfile = () => {
  const navigation = useNavigation();
  const [selectedConsole, setSelectedConsole] = useState(null); 
  const [selectedPC, setSelectedPC] = useState(""); 
  const [selectedXbox, setSelectedXbox] = useState(""); 
  const [selectedPlaystation, setSelectedPlaystation] = useState(""); 
  const [saveSuccess, setSaveSuccess] = useState(false);
  


  const consoleOptions = [
    { key: 'pc', label: 'PC' },
    { key: 'xbox', label: 'Xbox' },
    { key: 'playstation', label: 'Playstation' },
  ];

  const pcOptions = [
    { key: 'windows', label: 'Windows' },
  ];

  const xboxOptions = [
    { key: 'xbox', label: 'Xbox' },
    { key: 'xbox360', label: 'Xbox360' },
    { key: 'xboxone', label: 'Xbox One' },
  ];

  const playstationOptions = [
    { key: 'ps1', label: 'Playstation' },
    { key: 'ps2', label: 'Playstation 2' },
    { key: 'ps3', label: 'Playstation 3' },
    { key: 'ps4', label: 'Playstation 4' },
    { key: 'ps5', label: 'Playstation 5' },
    { key: 'psp', label: 'PSP' },
  ];

  const saveSelectedConsole = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error('Error saving console: User not authenticated');
        return;
      }

      const userId = currentUser.uid;
      const userDoc = await firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        console.error('Error saving console: User document not found');
        return;
      }

      let selectedOption;
      if (selectedConsole === 'PC') {
        selectedOption = selectedPC;
      } else if (selectedConsole === 'Xbox') {
        selectedOption = selectedXbox;
      } else if (selectedConsole === 'Playstation') {
        selectedOption = selectedPlaystation;
      }

      await firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            console: selectedOption
          },
          { merge: true }
        );

      setSaveSuccess(true);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      console.log("Console saved successfully!");
    } catch (error) {
      console.error("Error saving console:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginHorizontal: 16, marginTop: 20 }}>
        <SelectList
          setSelected={(val) => setSelectedConsole(val)} 
          data={consoleOptions.map(option => option.label)} 
          save="key"
        />
        {selectedConsole === 'PC' && (
          <View>
            <Text>Select PC</Text>
            <SelectList 
              setSelected={(val) => setSelectedPC(val)} 
              data={pcOptions.map(option => option.label)}
              save="key"
            />
          </View>
        )}
        {selectedConsole === 'Xbox' && (
          <View>
            <Text>Select Xbox</Text>
            <SelectList 
              setSelected={(val) => setSelectedXbox(val)} 
              data={xboxOptions.map(option => option.label)} 
              save="key"
            />
          </View>
        )}
       {selectedConsole === 'Playstation' && (
          <View>
            <Text>Select Playstation</Text>
            <SelectList 
              setSelected={(val) => setSelectedPlaystation(val)} 
              data={playstationOptions.map(option => option.label)} 
              save="key"
            />
          </View>
        )}
        {saveSuccess && (
          <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>Information saved successfully!</Text>
        )}
        <TouchableOpacity onPress={saveSelectedConsole} style={{backgroundColor: '#DE3F28', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
          style={{backgroundColor: '#225195', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20, marginHorizontal:96}}
            onPress={() => {
                navigation.navigate('Country');
              
          }}
        >
          <Text style={{color: 'white', fontWeight: 'bold'}}>Select Country</Text>
        </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

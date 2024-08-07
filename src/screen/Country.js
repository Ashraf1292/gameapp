import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { useQuery, gql } from '@apollo/client';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const COUNTRY_QUERY = gql`
  query CountryQuery {
    countries {
      name
    }
  }
`;

const Country = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { data, loading, error } = useQuery(COUNTRY_QUERY);

  const saveSelectedCountry = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error('Error saving country: User not authenticated');
        return;
      }

      const userId = currentUser.uid;

      await firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            country: selectedCountry
          },
          { merge: true }
        );

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      console.log('Country saved successfully!');
    } catch (error) {
      console.error('Error saving country:', error);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const countryOptions = data.countries.map(country => ({
    key: country.name,
    label: country.name,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Select a Country</Text>
      <SelectList
        setSelected={(val) => setSelectedCountry(val)}
        data={countryOptions.map(option => option.label)}
        save="key"
      />
      <TouchableOpacity
        onPress={saveSelectedCountry}
        style={{ backgroundColor: '#DE3F28', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20, width: 118 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
      </TouchableOpacity>
      {saveSuccess && (
        <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>Country saved successfully!</Text>
      )}
    </View>
  );
};

export default Country;

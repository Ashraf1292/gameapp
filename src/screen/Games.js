import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'react-native-heroicons/solid'; 
import axios from 'axios';


const Games = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGames = async () => {
      const options = {
        method: 'GET',
        url: 'https://opencritic-api.p.rapidapi.com/game',
        params: {
          platforms: 'all',
          skip: (page - 1) * 20
        },
        headers: {
          'X-RapidAPI-Key': '709d5e2a9cmsh97559358d6692e5p11c1fbjsn1a428982f833',
          'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        setGames(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, [page]);

  const nextPage = () => {
    setPage(page + 1, 5);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 20, paddingVertical:6}}>
      {games.map((game, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Text>{game.name}</Text>
          <Image
            source={{ uri: `https://img.opencritic.com/${game.images.banner.sm}` }}
            style={{ width: 322, height: 150}}
          />
        </View>
      ))}
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={prevPage} disabled={page === 1}>
          <ArrowLeftCircleIcon
            style={[styles.buttonIcon, page === 1 && styles.disabled]}
          />
        </TouchableOpacity>
        <Text style={styles.pageText}>Page {page}</Text>
        <TouchableOpacity onPress={nextPage} disabled={page === 5}>
          <ArrowRightCircleIcon
            style={[styles.buttonIcon, page === 5 && styles.disabled]}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    fontSize: 32,
    color: 'black'
  },
  disabled: {
    opacity: 0.5
  },
  pageText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Games;

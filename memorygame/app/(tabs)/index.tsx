import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Button } from 'react-native';

const images = [
  { id: 1, src: 'https://i.pinimg.com/236x/56/19/8c/56198c161497b2b35feead3a29970336.jpg' },
  { id: 2, src: 'https://i.pinimg.com/236x/56/19/8c/56198c161497b2b35feead3a29970336.jpg' },
  { id: 3, src: 'https://i.pinimg.com/236x/cc/e5/52/cce552de068f73a3643e015d6e54ce40.jpg' },
  { id: 4, src: 'https://i.pinimg.com/236x/cc/e5/52/cce552de068f73a3643e015d6e54ce40.jpg' },
  { id: 5, src: 'https://i.pinimg.com/236x/d3/26/c3/d326c369af10bc61c194011b0e93dbfd.jpg' },
  { id: 6, src: 'https://i.pinimg.com/236x/d3/26/c3/d326c369af10bc61c194011b0e93dbfd.jpg' },
];

const doubleImages = [...images, ...images].map((image, index) => ({ ...image, uniqueId: index }));

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(null);

  useEffect(() => {
    setCards(shuffleArray(doubleImages));
  }, []);

  useEffect(() => {
    if (openedCards.length === 2) {
      const [firstCard, secondCard] = openedCards;
      setDisabled(true);
      if (firstCard.src === secondCard.src) {
        setMatchedCards((prev) => [...prev, firstCard.uniqueId, secondCard.uniqueId]);
        setOpenedCards([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setOpenedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [openedCards]);

  useEffect(() => {
    let timer;
    if (matchedCards.length !== cards.length) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (matchedCards.length === cards.length && time > 0) {
      clearInterval(timer);
      setScore(Math.max(100 - time, 0)); 
    }
    return () => clearInterval(timer);
  }, [matchedCards, time, cards.length]);

  const handleCardPress = (card) => {
    if (
      !disabled &&
      openedCards.length < 2 &&
      !openedCards.some((openedCard) => openedCard.uniqueId === card.uniqueId) &&
      !matchedCards.includes(card.uniqueId)
    ) {
      setOpenedCards((prev) => [...prev, card]);
    }
  };

  const resetGame = () => {
    setCards(shuffleArray(doubleImages));
    setOpenedCards([]);
    setMatchedCards([]);
    setDisabled(false);
    setTime(0);
    setScore(null);
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.timer}>Süre: {time}</Text>
      <View style={styles.container}>
        {cards.map((card) => {
          const isFlipped = openedCards.some((openedCard) => openedCard.uniqueId === card.uniqueId) || matchedCards.includes(card.uniqueId);
          return (
            <TouchableOpacity key={card.uniqueId} style={styles.gridItem} onPress={() => handleCardPress(card)}>
              <View style={[styles.card, isFlipped && styles.flippedCard]}>
                {isFlipped ? (
                  <Image source={{ uri: card.src }} style={styles.image} />
                ) : (
                  <View style={styles.hiddenImage} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {matchedCards.length === cards.length && (
        <View style={styles.winContainer}>
          <Text style={styles.winText}>Tebrikler!</Text>
          <Text style={styles.scoreText}>Skor: {score}</Text>
          <Button title="Yeniden Oyna" onPress={resetGame} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF', 
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  flippedCard: {
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hiddenImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
  },
  winContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#32CD32', 
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8A2BE2', 
  },
});

export default App;

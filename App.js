import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [cartasJugador, setCartasJugador] = useState([]);
  const [cartasCrupier, setCartasCrupier] = useState([]);
  const [mazo, setMazo] = useState([]);
  const [puntuacionJugador, setPuntuacionJugador] = useState(0);
  const [puntuacionCrupier, setPuntuacionCrupier] = useState(0);

  useEffect(() => {
    inicializarMazo();
  }, []);

  const inicializarMazo = () => {
    const palos = ['Corazones', 'Diamantes', 'Tréboles', 'Espadas'];
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jota', 'Reina', 'Rey', 'As'];

    const nuevoMazo = [];

    for (const palo of palos) {
      for (const valor of valores) {
        nuevoMazo.push({ palo, valor });
      }
    }

    setMazo(nuevoMazo);
  };

  const repartirCarta = () => {
    if (mazo.length === 0) {
      inicializarMazo();
    }

    const indiceAleatorio = Math.floor(Math.random() * mazo.length);
    const carta = mazo[indiceAleatorio];

    const mazoActualizado = mazo.filter((_, indice) => indice !== indiceAleatorio);

    return { carta, mazoActualizado };
  };

  const iniciarJuego = () => {
    const cartaJugador1 = repartirCarta();
    const cartaCrupier1 = repartirCarta();
    const cartaJugador2 = repartirCarta();
    const cartaCrupier2 = repartirCarta();

    setCartasJugador([cartaJugador1.carta, cartaJugador2.carta]);
    setCartasCrupier([cartaCrupier1.carta, cartaCrupier2.carta]);
  };

  const calcularPuntuacion = (cartas) => {
    let puntuacion = 0;
    let contadorAses = 0;

    for (const carta of cartas) {
      const valor = carta.valor;

      if (valor === 'As') {
        contadorAses++;
        puntuacion += 11;
      } else if (['Jota', 'Reina', 'Rey'].includes(valor)) {
        puntuacion += 10;
      } else {
        puntuacion += parseInt(valor, 10);
      }
    }

    while (contadorAses > 0 && puntuacion > 21) {
      puntuacion -= 10;
      contadorAses--;
    }

    return puntuacion;
  };

  const determinarGanador = () => {
    const puntuacionJugador = calcularPuntuacion(cartasJugador);
    const puntuacionCrupier = calcularPuntuacion(cartasCrupier);

    if (puntuacionJugador > 21) {
      return 'Crupier';
    }

    if (puntuacionCrupier > 21) {
      return 'Jugador';
    }

    if (puntuacionJugador === puntuacionCrupier) {
      return 'Empate';
    }

    return puntuacionJugador > puntuacionCrupier ? 'Jugador' : 'Crupier';
  };

  const tomarCarta = () => {
    const nuevaCarta = repartirCarta();
    const cartasJugadorActualizadas = [...cartasJugador, nuevaCarta.carta];
    setCartasJugador(cartasJugadorActualizadas);

    const puntuacionJugador = calcularPuntuacion(cartasJugadorActualizadas);
    setPuntuacionJugador(puntuacionJugador);

    if (puntuacionJugador > 21) {
      const ganador = determinarGanador();
      alert(`El Crupier gana. ${ganador === 'Empate' ? 'Es un empate.' : `${ganador} gana.`}`);
    }
  };

  const plantarse = () => {
    let puntuacionCrupier = calcularPuntuacion(cartasCrupier);

    while (puntuacionCrupier < 17) {
      const nuevaCarta = repartirCarta();
      const cartasCrupierActualizadas = [...cartasCrupier, nuevaCarta.carta];
      setCartasCrupier(cartasCrupierActualizadas);
      puntuacionCrupier = calcularPuntuacion(cartasCrupierActualizadas);
    }

    const ganador = determinarGanador();
    alert(`${ganador === 'Empate' ? 'Es un empate.' : `${ganador} gana.`}`);
  };

  return (
    <View style={styles.contenedor}>
      <Text>Blackjack</Text>
      <Text>Puntuación del Jugador: {puntuacionJugador}</Text>
      <Text>Puntuación del Crupier: {puntuacionCrupier}</Text>
      <View>
        <Button title="Iniciar Juego" onPress={iniciarJuego} />
        <Button title="Tomar Carta" onPress={tomarCarta} />
        <Button title="Plantarse" onPress={plantarse} />
      </View>
      <View>
        <Text>Cartas del Jugador:</Text>
        <View style={styles.contenedorCartas}>
          {cartasJugador.map((carta, indice) => (
            <Text key={indice} style={styles.carta}>
              {carta.valor} de {carta.palo}
            </Text>
          ))}
        </View>
      </View>
      <View>
        <Text>Cartas del Crupier:</Text>
        <View style={styles.contenedorCartas}>
          {cartasCrupier.map((carta, indice) => (
            <Text key={indice} style={styles.carta}>
              {carta.valor} de {carta.palo}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorCartas: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  carta: {
    fontSize: 16,
    margin: 5,
  },
});

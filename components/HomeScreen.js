import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleScanBarcode = () => {
    navigation.navigate('BarCodeScanner');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Bem-vindo ao Scan Food</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Valores Nutricionais</Text>
        <Text style={styles.infoText}>
          Após escanear, você verá aqui os valores nutricionais do alimento, como calorias, proteínas, carboidratos, gorduras, etc.
        </Text>
        
        <Text style={styles.infoTitle}>Alergênicos</Text>
        <Text style={styles.infoText}>
          O aplicativo também exibirá se o alimento contém ingredientes que podem causar alergias, como glúten, leite, soja, entre outros.
        </Text>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanBarcode}>
        <Ionicons name="barcode-outline" size={60} color="#FADFB4" />
        <Text style={styles.scanButtonText}>Escanear Código de Barras</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FADFB4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#653F2C',
  },
  scanButton: {
    backgroundColor: '#A68768',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 40,
  },
  scanButtonText: {
    color: '#FADFB4',
    fontSize: 18,
    marginLeft: 10,
  },
  infoContainer: {
    backgroundColor: '#FFF6E1',
    padding: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#653F2C',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#7A5A44',
    marginBottom: 20,
  },
});

export default HomeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    try {
      const brazilResponse = await axios.get(`https://br.openfoodfacts.org/api/v0/product/${data}.json`);
      if (brazilResponse.data && brazilResponse.data.product) {
        setProductInfo(brazilResponse.data.product);
      } else {
        const globalResponse = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
        if (globalResponse.data && globalResponse.data.product) {
          setProductInfo(globalResponse.data.product);
      } else {
          setProductInfo(null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar informações do produto", error);
      setProductInfo(null);
    }
    setLoading(false);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setProductInfo(null);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão para acessar a câmera foi negada</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>FoodScanner</Text>
      </View>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#653F2C" />
          ) : productInfo ? (
            <>
              <Image source={{ uri: productInfo.image_url }} style={styles.productImage} />
              <Text style={styles.title}>Informações do Produto</Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Nome do Produto:</Text> {productInfo.product_name || 'Não disponível'}
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Descrição:</Text> {productInfo.description || 'Não disponível'}
              </Text>
              <Text style={styles.resultText}>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>Valores Nutricionais</Text>
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Calorias:</Text> {productInfo.nutriments['energy-kcal'] || 'Não disponível'} kcal
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Proteínas:</Text> {productInfo.nutriments['proteins'] || 'Não disponível'} g
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Carboidratos:</Text> {productInfo.nutriments['carbohydrates'] || 'Não disponível'} g
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Gorduras:</Text> {productInfo.nutriments['fat'] || 'Não disponível'} g
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Açúcares:</Text> {productInfo.nutriments['sugars'] || 'Não disponível'} g
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Sódio:</Text> {productInfo.nutriments['sodium'] || 'Não disponível'} mg
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Fibras:</Text> {productInfo.nutriments['fiber'] || 'Não disponível'} g
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Alergênicos:</Text> {productInfo.ingredients_text || 'Não disponível'}
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.label}>Porção:</Text> {productInfo.serving_size || 'Não disponível'}
              </Text>
              <TouchableOpacity style={styles.scanButton} onPress={handleScanAgain}>
                <Ionicons name="barcode-outline" size={60} color="#FADFB4" />
                <Text style={styles.scanButtonText}>Escanear outro produto</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.resultText}>Produto não encontrado.</Text>
              <TouchableOpacity style={styles.scanButton} onPress={handleScanAgain}>
                <Ionicons name="barcode-outline" size={60} color="#FADFB4" />
                <Text style={styles.scanButtonText}>Escanear Novamente</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
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
  resultContainer: {
    padding: 20,
    backgroundColor: '#FFF6E1',
    borderRadius: 10,
    marginBottom: 40,
    flexGrow: 1,
  },
  resultText: {
    fontSize: 16,
    color: '#7A5A44',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#653F2C',
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#A68768',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  scanButtonText: {
    color: '#FADFB4',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default Scanner;

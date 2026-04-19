import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, FONT, SIZES } from "../../constants";
import DailyMeditation from "../../components/DailyMeditation";
import { useFocusEffect } from "expo-router";
import ScreenHeaderBtn from '../../components/ScreenHeaderBtn'

const Favourites = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem("favorites");
            const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(favoritesArray);
        } catch (error) {
            console.error("Error loading favorites:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBackground }}>
        <ScreenHeaderBtn/>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : favorites.length === 0 ? (
                <Text style={styles.headerTitle}>No se encontraron elementos favoritos.</Text>
            ) : (
                <>
                    <Text style={{ textAlign: "center", color: "#FF4500", fontWeight: "bold" }}>Mis Ejercicios Favoritos</Text>
                    <DailyMeditation meditations={favorites} />
                </>
            )}
            </View>
        </ScrollView>
        </SafeAreaView>
    )
}


export default Favourites;

const styles = StyleSheet.create({
    container: {
        marginTop: SIZES.xLarge,
        padding: SIZES.medium,
    },
    headerTitle: {
        fontSize: SIZES.large,
        fontFamily: FONT.medium,
        color: COLORS.primary,
        textAlign: "center",
        marginTop: 20,
    },
});
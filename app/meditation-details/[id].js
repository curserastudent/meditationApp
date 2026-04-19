import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Share,
  Alert,
  StyleSheet,
} from "react-native";

import MeditationTopDisplay from "../../components/MeditationTopDisplay/MeditationTopDisplay";
import About from "../../components/about/About";
import Footer from "../../components/footer/Footer";
import Tabs from "../../components/tabs/Tabs";
import ScreenHeaderBtn from "../../components/ScreenHeaderBtn";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";

const tabs = ["Acerca de", "Instrucciones"];

const MeditationDetails = () => {
  const params = useGlobalSearchParams();
  const router = useRouter();
  const id = params.id;

  const { data, isLoading, error, refetch } = useFetch("search", {
    query: id,
  });

  const meditationItem = useFetch().getItemById(parseInt(id, 10));

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    if (activeTab === "Acerca de") {
      return (
        <About
          title={meditationItem.title}
          info={meditationItem.description ?? "No se proporcionaron datos"}
        />
      );
    } else if (activeTab === "Instrucciones") {
      return (
        <View style={styles.specificsContainer}>
          <Text style={styles.specificsTitle}>Instrucciones:</Text>
          <View style={styles.pointsContainer}>
            {(meditationItem.instructions ?? ["N/A"]).map((item, index) => (
              <View style={styles.pointWrapper} key={index}>
                <View style={styles.pointDot} />
                <Text style={styles.pointText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }
    return null;
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Mira esta meditación: ${meditationItem.title} (${meditationItem.duration})`,
      });

      if (result.action === Share.dismissedAction) {
        // cancelado
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />

      <ScreenHeaderBtn detailPage={true} handleShare={onShare} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Algo salió mal</Text>
        ) : !meditationItem || meditationItem.length === 0 ? (
          <Text>No hay datos disponibles</Text>
        ) : (
          <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
            <MeditationTopDisplay
              meditationImage={meditationItem.image}
              meditationTitle={meditationItem.title}
              duration={meditationItem.duration}
              target={meditationItem.target}
            />

            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {displayTabContent()}
          </View>
        )}
      </ScrollView>

      <Footer data={meditationItem} />
    </SafeAreaView>
  );
};

export default MeditationDetails;

const styles = StyleSheet.create({
  specificsContainer: {
    padding: SIZES.medium,
  },
  specificsTitle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    marginBottom: SIZES.small,
  },
  pointsContainer: {
    marginTop: SIZES.small,
  },
  pointWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.small / 2,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: SIZES.small,
  },
  pointText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
});
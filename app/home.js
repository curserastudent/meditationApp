import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenHeaderBtn from "../components/ScreenHeaderBtn";
import Welcome from "../components/Welcome";
import PopularMeditation from "../components/PopularMeditation";
import DailyMeditation from "../components/DailyMeditation";
import { useTheme } from "../context/ThemeProvider";

const Home = () => {
    const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    const user = await AsyncStorage.getItem("userDetails");
    console.log("user", user);
    setUserDetails(user);
  };
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme === "dark";
    return (
     <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite,
        }}
      >
        <ScreenHeaderBtn/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              padding: SIZES.medium,

            }}
            testID="screensDisplay"
          >
            <Welcome userDetails={userDetails ? JSON.parse(userDetails) : null} isDarkMode={isDarkMode}/>
            <PopularMeditation isDarkMode={isDarkMode}/>
            <DailyMeditation isDarkMode={isDarkMode}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
    );
  };

  export default Home;
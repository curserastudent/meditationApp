import { View, Text } from "react-native";

import styles from "./About.style";

const About = ({ info, title }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.headText}>About {title}:</Text>

        <View style={styles.contentBox}>
            <Text style={styles.contextText}>{info}</Text>
        </View>
        </View>
    );
};

export default About;
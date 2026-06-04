import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { T, fontSerif, fontSans } from "../src/tokens";

function P({ children, bold }) {
  return <Text style={{ fontFamily: fontSans(bold ? 700 : 400), fontSize: 15, color: T.textMid, lineHeight: 24, marginBottom: 14 }}>{children}</Text>;
}
function H({ children }) {
  return <Text style={{ fontFamily: fontSerif(700), fontSize: 18, color: T.text, marginTop: 10, marginBottom: 10 }}>{children}</Text>;
}

export default function Privacy() {
  const router = useRouter();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={{ width: "100%", maxWidth: 660, alignSelf: "center", padding: 24 }}>
        <Pressable onPress={() => router.replace("/")}>
          <Text style={{ fontFamily: fontSans(600), fontSize: 14, color: T.accent, marginBottom: 20 }}>← Back to SeeTheMath</Text>
        </Pressable>
        <Text style={{ fontFamily: fontSerif(700), fontSize: 28, color: T.text, marginBottom: 6 }}>Privacy Policy</Text>
        <Text style={{ fontFamily: fontSans(400), fontSize: 13, color: T.textMuted, marginBottom: 24 }}>Last updated: June 2026</Text>

        <P bold>SeeTheMath does not collect any personal information.</P>
        <P>
          SeeTheMath is a free, educational math app for students, parents, and teachers. It is designed to be safe for
          children. The app runs entirely on your device.
        </P>

        <H>What we collect</H>
        <P>
          Nothing. The app has no user accounts, no login, and no backend server. We do not collect, store, transmit,
          or share any personal information, usage data, or analytics. There are no advertisements and no third-party
          tracking technologies in the app.
        </P>

        <H>Data stored on your device</H>
        <P>
          Any state (such as which topic you are viewing) lives only in your device's memory while the app is open and
          is never sent anywhere.
        </P>

        <H>Children's privacy</H>
        <P>
          Because the app collects no data at all, it does not knowingly collect information from children under 13 (or
          any age). It is intended to comply with COPPA and Google Play's Families policies through the simple approach
          of not collecting data.
        </P>

        <H>Contact</H>
        <P>If you have any questions about this policy, contact the developer at islam.kamel.taha@gmail.com.</P>
      </View>
    </ScrollView>
  );
}

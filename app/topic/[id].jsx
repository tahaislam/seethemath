import { ScrollView, View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T, fontSerif, fontSans } from "../../src/tokens";
import { getTopic, TOPICS } from "../../src/topics";

// Pre-render a static HTML page for every topic (better deep-linking + SEO).
export async function generateStaticParams() {
  return TOPICS.map((t) => ({ id: t.id }));
}

export default function TopicScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topic = getTopic(id);

  const goHome = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 60 + insets.bottom }}
      stickyHeaderIndices={[0]}
    >
      {/* Header stays pinned and its background fills the status-bar area (insets.top). */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 14 + insets.top, paddingBottom: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.card }}>
        <Pressable onPress={() => router.replace("/")} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: T.accent, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontFamily: fontSerif(700) }}>∑</Text>
          </View>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 18, color: T.text }}>SeeTheMath</Text>
        </Pressable>
        <Pressable onPress={goHome} style={{ backgroundColor: T.accentLight, borderWidth: 1, borderColor: T.accentMid, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 }}>
          <Text style={{ fontFamily: fontSans(600), fontSize: 13, color: T.accent }}>← All Topics</Text>
        </Pressable>
      </View>

      {topic ? (
        <topic.Module />
      ) : (
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 20, color: T.text }}>Topic not found</Text>
          <Pressable onPress={() => router.replace("/")} style={{ marginTop: 16 }}>
            <Text style={{ fontFamily: fontSans(600), fontSize: 14, color: T.accent }}>← Back to all topics</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

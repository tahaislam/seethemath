import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T, fontSerif, fontSans, STRANDS } from "../src/tokens";
import { TOPICS } from "../src/topics";

function Logo() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: T.accent, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#fff", fontSize: 18, fontFamily: fontSerif(700) }}>∑</Text>
      </View>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 18, color: T.text }}>SeeTheMath</Text>
    </View>
  );
}

function gradeLabel(grade) {
  if (!grade || !grade.length) return "";
  return grade.length === 1 ? `Grade ${grade[0]}` : `Grades ${grade[0]}–${grade[grade.length - 1]}`;
}

function TopicCard({ topic, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: T.card, borderWidth: 1.5, borderColor: T.border, borderRadius: 14,
        padding: 20, flexGrow: 1, flexBasis: 260, minWidth: 240, maxWidth: 380,
        shadowColor: "#2a2520", shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: topic.color + "18", borderWidth: 1.5, borderColor: topic.color + "22", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 22 }}>{topic.icon}</Text>
        </View>
        <View style={{ backgroundColor: topic.color + "14", borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: fontSans(700), fontSize: 11, color: topic.color }}>{gradeLabel(topic.grade)}</Text>
        </View>
      </View>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 18, color: T.text, marginBottom: 6 }}>{topic.title}</Text>
      <Text style={{ fontFamily: fontSans(400), fontSize: 13.5, color: T.textMid, lineHeight: 20 }}>{topic.desc}</Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 60 + insets.bottom }}
      stickyHeaderIndices={[0]}
    >
      {/* Header stays pinned and its background fills the status-bar area (insets.top). */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 14 + insets.top, paddingBottom: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.card }}>
        <Logo />
      </View>

      <View style={{ width: "100%", maxWidth: 880, alignSelf: "center", paddingHorizontal: 20 }}>
        <View style={{ alignItems: "center", marginTop: 36, marginBottom: 36 }}>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 32, color: T.text, textAlign: "center", lineHeight: 40 }}>
            See the math. <Text style={{ color: T.accent }}>Get the math.</Text>
          </Text>
          <Text style={{ fontFamily: fontSans(400), fontSize: 16, color: T.textMid, marginTop: 14, maxWidth: 520, textAlign: "center", lineHeight: 24 }}>
            Interactive visual walkthroughs for the concepts that trip up middle schoolers, organized by the Ontario curriculum strands.
          </Text>
        </View>

        {STRANDS.map((strand) => {
          const topics = TOPICS.filter((t) => t.strand === strand.id);
          if (!topics.length) return null;
          return (
            <View key={strand.id} style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: strand.color }} />
                <Text style={{ fontFamily: fontSans(700), fontSize: 13, letterSpacing: 1.2, color: strand.color }}>{strand.label.toUpperCase()}</Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
                {topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} onPress={() => router.push(`/topic/${topic.id}`)} />
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ alignItems: "center", marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: T.border }}>
          <Text style={{ fontFamily: fontSans(400), fontSize: 13, color: T.textMuted, textAlign: "center" }}>
            SeeTheMath is free and open source. Built by Islam Taha for learners everywhere.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

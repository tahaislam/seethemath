import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  LibreBaskerville_400Regular,
  LibreBaskerville_700Bold,
} from "@expo-google-fonts/libre-baskerville";
import {
  SourceSans3_400Regular,
  SourceSans3_500Medium,
  SourceSans3_600SemiBold,
  SourceSans3_700Bold,
} from "@expo-google-fonts/source-sans-3";
import { T } from "../src/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    SourceSans3_400Regular,
    SourceSans3_500Medium,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  // On the WEB we intentionally do NOT block rendering on `loaded`: blocking
  // would leave the static (SSR) HTML empty and hurt SEO, and the browser
  // re-flows text when the webfont swaps in.
  //
  // On NATIVE we must wait: if we render with the system fallback font first,
  // text gets measured at the (narrower) fallback width, and when the wider
  // Libre Baskerville serif swaps in it overflows that measured width and the
  // trailing characters are clipped (e.g. "SeeTheMath" -> "SeeTheM"). Keeping
  // the splash up until fonts load makes text measure with the real font.
  if (!loaded && Platform.OS !== "web") {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: T.bg },
        }}
      />
    </SafeAreaProvider>
  );
}

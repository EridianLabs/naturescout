import { StatusBar } from 'expo-status-bar'
import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces'
import { Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold } from '@expo-google-fonts/outfit'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ProgressProvider } from '@/hooks/useProgress'
import { RootNavigator } from '@/navigation/RootNavigator'
import { colors } from '@/theme'

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.forest} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </ProgressProvider>
    </SafeAreaProvider>
  )
}

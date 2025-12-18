import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { InventoryProvider } from '../src/context/InventoryContext';

export default function Layout() {
    return (
        <SafeAreaProvider>
            <InventoryProvider>
                <StatusBar style="light" />
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: Colors.surface,
                        },
                        headerTintColor: Colors.textPrimary,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        contentStyle: {
                            backgroundColor: Colors.background,
                        }
                    }}
                >
                    <Stack.Screen name="index" options={{ title: 'Início', headerShown: false }} />
                    <Stack.Screen name="conference" options={{ title: 'Conferência' }} />
                    <Stack.Screen name="sales" options={{ title: 'Vendas' }} />
                    <Stack.Screen name="category/[id]" options={{ title: 'Categoria' }} />
                </Stack>
            </InventoryProvider>
        </SafeAreaProvider>
    );
}

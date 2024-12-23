import { Redirect } from "expo-router";

const HomePage = () => {
  return (
    // <Stack>
    //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    // </Stack>
    <Redirect href="/home" />
  );
};

export default HomePage;

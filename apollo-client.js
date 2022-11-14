import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://kokomo.stepzen.net/api/hoping-beetle/__graphql",
  headers: {
    Authorization: `APIKey ${process.env.NEXT_PUBLIC_STEPZEN_API_KEY}`,
    "Content-Type": "application/json",
  },

  cache: new InMemoryCache(),
});

export default client;

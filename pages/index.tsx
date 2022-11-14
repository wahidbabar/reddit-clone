import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed/Feed";
import Header from "../components/Header/Header";
import PostBox from "../components/PostBox/PostBox";
import SubredditRow from "../components/SubredditRow/SubredditRow";
import { GET_SUBREDDITS_WITH_LIMIT } from "../graphql/queries";

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDITS_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  });

  const subreddits: Subreddit[] = data?.getSubredditListLimit;

  console.log("data", subreddits);

  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Head>
        <title>Reddit Clone 2.0</title>
        <link rel="icon" href="/reddit-logo-16.png" />
      </Head>

      {/* Post Box */}
      <PostBox />

      {/* Feed */}
      <div className="flex">
        <Feed />

        <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {subreddits?.map((subreddit, i) => (
              <SubredditRow
                key={subreddit.id}
                subreddit={subreddit}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

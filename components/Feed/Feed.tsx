import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from "../../graphql/queries";
import Post from "../Post/Post";

type Props = {
  topic?: string;
};

function Feed({ topic }: Props) {
  const { data } = topic
    ? useQuery(GET_ALL_POSTS_BY_TOPIC, { variables: { topic: topic } })
    : useQuery(GET_ALL_POSTS);

  const posts: Post[] = topic ? data?.getPostListByTopic : data?.getPostList;

  return (
    <div className="flex flex-col flex-1 mt-5 space-y-4">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;

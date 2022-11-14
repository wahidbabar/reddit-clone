import React, { useEffect, useState } from "react";

import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftEllipsisIcon,
  GiftIcon,
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../Avatar/Avatar";
import TimeAgo from "react-timeago";
import Image from "next/image";
import Link from "next/link";
import { Waveform } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_VOTES_BY_POST_ID } from "../../graphql/queries";
import { ADD_VOTE } from "../../graphql/mutations";

type Props = {
  post: Post;
};

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>();
  const { data: session } = useSession();

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast("❗ You'll need to sign in to vote");
      return;
    }

    if (vote && isUpvote) return;
    if (vote === false && !isUpvote) return;

    const {
      data: { insertVote: newVote },
    } = await addVote({
      variables: {
        upvote: isUpvote,
        post_id: post.id,
        username: session?.user?.name,
      },
    });
  };

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;

    // Latest vote (as we sorted by newely created first in SQL query)
    // Note: You could improve this by moving it to the origianl query

    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote;
    setVote(vote);
  }, [data]);

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;

    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }

    return displayNumber;
  };

  if (!post) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Waveform size={50} color="##FF4501" />
      </div>
    );
  }

  return (
    <Link href={`/post/${post?.id}`}>
      <div className="flex cursor-pointer border hover:border rounded-md border-gray-300 bg-white shadow-sm hover:border-gray-600">
        {/* Votes */}
        <div className="flex flex-col p-4 items-center bg-gray-50 rounded-l-md text-gray-400 space-y-1 justify-start">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButtons hover:text-red-400 ${
              vote && "text-red-400"
            }`}
          />
          <p className="text-black font-bold text-xs">{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButtons hover:text-blue-400 ${
              vote === false && "text-blue-400"
            }`}
          />
        </div>

        {/* Main Body */}

        <div className="p-3 pb-1">
          {/* Header */}

          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddit[0]?.topic} />
            <p className="text-gray-400 text-xs">
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit[0]?.topic}
                </span>
              </Link>{" "}
              • Posted by u/
              {post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>

          {/* Body */}

          <div className="py-4">
            <p className="text-xl font-semibold">{post.title}</p>
            <p className="mt-2 text-xs font-light">{post.body}</p>
          </div>

          {/* Image */}
          {post.image && (
            <div className="w-full">
              <Image
                objectFit="contain"
                src={post.image}
                alt="Post Image"
                width={800}
                height={800}
              />
            </div>
          )}

          {/* Footer */}

          <div className="flex space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
              <p>{post.comments.length} Comments</p>
            </div>
            <div className="postButtons">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButtons">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Post;

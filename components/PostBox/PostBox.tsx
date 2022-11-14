import React, { useState } from "react";

import { useSession } from "next-auth/react";
import Avatar from "../Avatar/Avatar";
import { PhotoIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import client, { useMutation, useLazyQuery } from "@apollo/client";
import { ADD_POST, ADD_SUBREDDIT } from "../../graphql/mutations";
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from "../../graphql/queries";
import toast from "react-hot-toast";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

type Props = {
  subreddit?: string;
};

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession();
  const [getSubreddit] = useLazyQuery(GET_SUBREDDIT_BY_TOPIC);
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }, "getPostList"],
  });

  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    const notify = toast.loading("Creating new post...");

    try {
      // Query for the subreddit topic...
      const {
        data: { getSubredditListByTopic },
      } = await getSubreddit({
        variables: { topic: subreddit || formData.subreddit },
      });

      console.log("formData", formData);

      const subredditExisits = getSubredditListByTopic.length > 0;
      console.log("Subreddit already exists", getSubredditListByTopic);

      if (!subredditExisits) {
        // create subreddit
        console.log("Subreddit is new! -> creating a NEW subreddit!");

        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });

        // add post
        console.log("Creating post...", formData);
        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            username: session?.user?.name,
            title: formData.postTitle,
            subreddit_id: newSubreddit.id,
          },
        });

        console.log("Added Post", newPost);
      } else {
        // use existing subreddit
        // add post

        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            username: session?.user?.name,
            title: formData.postTitle,
            subreddit_id: getSubredditListByTopic[0].id,
          },
        });

        console.log("A new post for an existing subreddit was added!", newPost);
      }

      // After the post has been added

      setValue("postBody", "");
      setValue("postTitle", "");
      setValue("postImage", "");
      setValue("subreddit", "");

      toast.success("New post created!", {
        id: notify,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notify,
      });
      console.log(error);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-20 z-50 bg-white border-gray-300 p-2 rounded-md"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar />

        <input
          {...register("postTitle", { required: true })}
          disabled={!session}
          className="bg-gray-50 outline-none rounded-md pl-5 p-2 flex-1"
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : "Create a post by entering a titile!"
              : "Sign in to post"
          }
        />
        <PhotoIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && "text-blue-300"
          }`}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              {...register("postBody")}
              className="m-2 flex-1 bg-blue-50 outline-none p-2"
              type="text"
              placeholder="Text (optional)"
            />
          </div>

          {/* Subreddit */}
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                {...register("subreddit", { required: true })}
                className="m-2 flex-1 bg-blue-50 outline-none p-2"
                type="text"
                placeholder="i.e. reactjs"
              />
            </div>
          )}

          {/* Image */}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                {...register("postImage")}
                className="m-2 flex-1 bg-blue-50 outline-none p-2"
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>A Post Title is required</p>
              )}
              {errors.subreddit?.type === "required" && (
                <p>A Subreddit is required</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              type="submit"
              className="bg-blue-400 rounded-full w-full p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;

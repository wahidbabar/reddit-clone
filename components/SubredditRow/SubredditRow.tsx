import React from "react";

import { ChevronUpIcon } from "@heroicons/react/24/outline";
import Avatar from "../Avatar/Avatar";
import Link from "next/link";

type Props = {
  subreddit: Subreddit;
  index: number;
};

function SubredditRow({ subreddit, index }: Props) {
  return (
    <div
      className="flex items-center space-x-2 border-t space-y-1 border-gray-300 bg-white px-4 py-2 last:rounded-b"
      key={subreddit.id}
    >
      <p>{index + 1}</p>
      <ChevronUpIcon className="h-4 w-4 flex-shrink-0 text-green-400" />
      <Avatar seed={subreddit.topic} />
      <p className="flex-1 truncate">r/{subreddit.topic}</p>
      <Link href={`/subreddit/${subreddit.topic}`}>
        <div className="cursor-pointer rounded-full bg-blue-500 px-3 text-white">
          View
        </div>
      </Link>
    </div>
  );
}

export default SubredditRow;

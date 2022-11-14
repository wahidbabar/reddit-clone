import React from "react";

import Avatar from "../Avatar/Avatar";
import ReactTimeago from "react-timeago";

type Props = {
  comment: Comment;
};

function CommentRow({ comment }: Props) {
  return (
    <div className="relative flex items-center space-x-2 space-y-5">
      <hr className="absolute top-10 left-7 z-0 h-16 border" />
      <div className="z-50">
        <Avatar seed={comment.username} />
      </div>

      <div className="flex flex-col">
        <p className="py-2 text-xs text-gray-400">
          <span className="font-semibold text-gray-600">
            {comment.username}
          </span>{" "}
          <ReactTimeago date={comment.created_at} />
        </p>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}

export default CommentRow;

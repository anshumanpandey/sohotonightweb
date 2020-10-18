

import React from 'react';
import { parseISO, formatRelative } from 'date-fns'

function PostItem({ post, user }: { post: any, user: any }) {
    return (
        <div className="box box-widget" style={{ display: "flex", flexDirection: "column" }}>
            <div className="box-header with-border">
                <div className="user-block">
                    <img className="img-circle" src={user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="User Image" />
                    <span className="username">
                        <a href="#">
                            {user.nickname}
                        </a>
                    </span>
                    <span className="description">Shared publicly - {formatRelative(parseISO(post.createdAt), new Date())}</span>
                </div>
            </div>

            <div className="box-body" style={{ display: "block" }}>
                <p style={{ margin: "7px 0 0 0" }}>
                    {post?.body}
                </p>

            </div>
        </div>
    );
}
export default PostItem;

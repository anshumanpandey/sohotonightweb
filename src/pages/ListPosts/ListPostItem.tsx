import React from "react";
import { Link } from "react-router-dom";
import { CallIcons } from "../../partials/CallIcons";
import GetUserAge from "../../utils/GetUserAge";
import UseIsMobile from "../../utils/UseIsMobile";
import UserLoggedIsModel from "../../utils/UserLoggedIsModel";

const ListPostItem = ({ girl: g }: { girl: any }) => {
  const isMobile = UseIsMobile();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderBottom: "1px solid #d8d8d8",
      }}
    >
      <div
        style={{
          flex: 1,
          paddingLeft: 0,
          paddingTop: "2rem",
          paddingBottom: "2rem",
          paddingRight: "2rem",
        }}
      >
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
          to={`/profile/${g.id}`}
        >
          <img
            style={{
              borderRadius: "50%",
              maxWidth: "100%",
              maxHeight: 100,
              minHeight: 100,
            }}
            src={
              g.profilePic ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            }
            className="img-responsive"
            alt="profile"
          />
        </Link>
      </div>
      <div
        style={{
          width: isMobile ? "70%" : "75%",
          paddingTop: "2rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ width: "100%" }}>
          <Link
            style={{
              marginBottom: "10px",
              fontSize: 15,
              display: "inline-block",
              color: "black",
              fontWeight: "bold",
            }}
            to={`/profile/${g.id}`}
          >
            {g.nickname}
          </Link>
          <p>
            {g.orientation} {GetUserAge(g)} year old {g.gender}
          </p>
          {g.aboutYouDetail && (
            <p style={{ wordWrap: "break-word" }}>{g.aboutYouDetail}</p>
          )}
        </div>
        {UserLoggedIsModel() === false && (
          <div style={{ width: "100%" }}>
            <div>
              <p
                style={{
                  fontFamily: "AeroliteItalic",
                  fontSize: 16,
                  textAlign: isMobile ? "start" : "end",
                }}
              >
                Call me now for one to one live chat:{" "}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginRight: "2rem",
                }}
              >
                <CallIcons disabled={false} model={g} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPostItem;

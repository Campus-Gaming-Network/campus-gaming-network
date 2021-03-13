// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

// Hooks
import useScript from "src/hooks/useScript";

// Source: https://dev.twitch.tv/docs/embed/everything
const TWITCH_EMBED_SCRIPT_URL = "https://embed.twitch.tv/embed/v1.js";

////////////////////////////////////////////////////////////////////////////////
// TwitchEmbed

const TwitchEmbed = ({
  allowfullscreen = true,
  autoplay = false,
  channel = "",
  collection = "",
  height = 480,
  layout = "video-with-chat",
  muted = false,
  parent = [],
  theme = "dark",
  time = "",
  video = "",
  width = 854,
  ...rest
}) => {
  const scriptStatus = useScript(TWITCH_EMBED_SCRIPT_URL);
  const embedId = React.useMemo(() => `twitch-embed-${channel}`, [channel]);

  React.useEffect(() => {
    if (scriptStatus === "ready") {
      new Twitch.Embed(embedId, {
        allowfullscreen,
        autoplay,
        channel,
        collection,
        height,
        layout,
        muted,
        parent,
        theme,
        time,
        video,
        width
      });
    }
  }, [
    allowfullscreen,
    autoplay,
    channel,
    collection,
    height,
    layout,
    muted,
    parent,
    theme,
    time,
    video,
    width,
    embedId,
    scriptStatus
  ]);

  if (!Boolean(channel)) {
    return null;
  }

  return <Box id={embedId} {...rest} />;
};

export default TwitchEmbed;

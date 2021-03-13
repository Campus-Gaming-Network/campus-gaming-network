// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";

// Hooks
import useScript from "src/hooks/useScript";

const TWITCH_EMBED_SCRIPT_URL = "https://embed.twitch.tv/embed/v1.js";

////////////////////////////////////////////////////////////////////////////////
// TwitchEmbed

// Source: https://dev.twitch.tv/docs/embed/everything
const TwitchEmbed = ({
  allowfullscreen = true,
  autoplay = false,
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
  const status = useScript(TWITCH_EMBED_SCRIPT_URL);
  const embedId = React.useMemo(() => `twitch-embed-${props.channel}`, [
    props.channel
  ]);

  React.useEffect(() => {
    if (status === "ready") {
      new Twitch.Embed(embedId, {
        allowfullscreen,
        autoplay,
        collection,
        height,
        layout,
        muted,
        parent,
        theme,
        time,
        video,
        width,
        channel: props.channel
      });
    }
  }, [props.channel, props.config, status]);

  if (!Boolean(props.channel)) {
    return null;
  }

  return <Box id={embedId} {...rest} />;
};

export default TwitchEmbed;

// Libraries
import React from 'react';
import { Box } from '@chakra-ui/react';

// Hooks
import useScript from 'src/hooks/useScript';

// Constants
import { TWITCH_EMBED_SCRIPT_URL } from 'src/constants/other';

////////////////////////////////////////////////////////////////////////////////
// TwitchEmbed

const TwitchEmbed = ({
  id = null,
  allowfullscreen = true,
  autoplay = false,
  channel = '',
  collection = '',
  height = 480,
  layout = 'video-with-chat',
  muted = false,
  parent = [],
  theme = 'dark',
  time = '',
  video = '',
  width = '100%',
  ...rest
}) => {
  const scriptStatus = useScript(TWITCH_EMBED_SCRIPT_URL);
  const embedId = React.useMemo(() => id || `twitch-embed-${channel}`, [id, channel]);

  React.useEffect(() => {
    if (scriptStatus === 'ready') {
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
        width,
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
    scriptStatus,
  ]);

  if (!Boolean(channel)) {
    return null;
  }

  return <Box id={embedId} {...rest} />;
};

export default TwitchEmbed;

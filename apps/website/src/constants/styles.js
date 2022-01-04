////////////////////////////////////////////////////////////////////////////////
// Style Constants

export const FONT_STACK =
  'Lato, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji';

export const CUSTOM_CHAKRA_THEME = {
  colors: {
    brand: {
      500: '#F15A29',
      300: '#F7941D',
      100: '#FBB040',
    },
  },
  fonts: {
    body: FONT_STACK,
    heading: FONT_STACK,
  },
};

export const DROPZONE_STYLES = {
  BASE: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  },
  ACTIVE: {
    borderColor: '#2196f3',
  },
  ACCEPT: {
    borderColor: '#00e676',
  },
  REJECT: {
    borderColor: '#ff1744',
  },
};

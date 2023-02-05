import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Dimensions, Platform } from "react-native";
export const url = {};

//Size

export const screenHeight = {
  height20: Math.round((20 / 100) * Dimensions.get("window").height),
  height30: Math.round((40 / 100) * Dimensions.get("window").height),
  height35: Math.round((35 / 100) * Dimensions.get("window").height),
  height40: Math.round((40 / 100) * Dimensions.get("window").height),
  height42: Math.round((42 / 100) * Dimensions.get("window").height),

  height50: Math.round((50 / 100) * Dimensions.get("window").height),
  height45: Math.round((45 / 100) * Dimensions.get("window").height),

  height55: Math.round((55 / 100) * Dimensions.get("window").height),

  height60: Math.round((60 / 100) * Dimensions.get("window").height),
  height70: Math.round((70 / 100) * Dimensions.get("window").height),
  height80: Math.round((80 / 100) * Dimensions.get("window").height),

  height100: Math.round(Dimensions.get("window").height),
};

export const screenWidth = {
  width2: Math.round((2 / 100) * Dimensions.get("window").width),
  width5: Math.round((5 / 100) * Dimensions.get("window").width),
  width10: Math.round((10 / 100) * Dimensions.get("window").width),

  width12: Math.round((12 / 100) * Dimensions.get("window").width),
  width13: Math.round((13 / 100) * Dimensions.get("window").width),
  width14: Math.round((14 / 100) * Dimensions.get("window").width),
  width15: Math.round((15 / 100) * Dimensions.get("window").width),
  width17: Math.round((17 / 100) * Dimensions.get("window").width),
  width18: Math.round((18 / 100) * Dimensions.get("window").width),

  width20: Math.round((20 / 100) * Dimensions.get("window").width),
  width25: Math.round((25 / 100) * Dimensions.get("window").width),
  width26: Math.round((26 / 100) * Dimensions.get("window").width),
  width27: Math.round((27 / 100) * Dimensions.get("window").width),
  width28: Math.round((28 / 100) * Dimensions.get("window").width),
  width29: Math.round((29 / 100) * Dimensions.get("window").width),

  width30: Math.round((30 / 100) * Dimensions.get("window").width),
  width35: Math.round((35 / 100) * Dimensions.get("window").width),
  width37: Math.round((37 / 100) * Dimensions.get("window").width),
  width38: Math.round((38 / 100) * Dimensions.get("window").width),
  width39: Math.round((39 / 100) * Dimensions.get("window").width),

  width40: Math.round((40 / 100) * Dimensions.get("window").width),
  width42: Math.round((42 / 100) * Dimensions.get("window").width),
  width41: Math.round((41 / 100) * Dimensions.get("window").width),
  width45: Math.round((45 / 100) * Dimensions.get("window").width),

  width50: Math.round((50 / 100) * Dimensions.get("window").width),
  width55: Math.round((55 / 100) * Dimensions.get("window").width),

  width60: Math.round((60 / 100) * Dimensions.get("window").width),
  width65: Math.round((65 / 100) * Dimensions.get("window").width),

  width70: Math.round((70 / 100) * Dimensions.get("window").width),
  width75: Math.round((75 / 100) * Dimensions.get("window").width),

  width80: Math.round((80 / 100) * Dimensions.get("window").width),
  width85: Math.round((85 / 100) * Dimensions.get("window").width),

  width90: Math.round((90 / 100) * Dimensions.get("window").width),
  width95: Math.round((95 / 100) * Dimensions.get("window").width),

  width100: Math.round(Dimensions.get("window").width),
};

//colors
export const colors = {
  textHeadingColor: "#212121",
  textColor: "#424242",
  Blue: "#26495c",
  lightBrown: "#c4a35a",
  brown: "#c66b3d",
  gray: "#e5e5dc",
  mapCircleColor: "#1278EE",
  themeSecondary: "#52616B",

  grayBg: "#ececec",

  placeholder: "#CBCBCB",
  black: "#000",
  white: "#fff",
  lightBlue: "#77AFDF",
  blueDark: "#186596",
  blueBeryline: "#33CEDA",
  border: "#A7AFC4",
  inactive: "#9EB8CF",
  grey: "#a6a6a6",
  facebook: "#2672CB",
  apple: "#050708",
  blue: "blue",
  blueN: "#015EDF",
  //
  greyDark: "#686868",
  greyLight: "#8F9BB3",
  label: "#8992A3",
  green: "#56B50D",
  light: "#F8F8F8",
  red: "#DC4E41",
  orange: "#FC6011",

  like: "#DC4E41",
  redTheme: "#D35252",
  unlike: "#C4C4C4",
  overlay: "rgba(17,38,60,0.30)",

  outlineBg: "rgba(20,89,166,0.22)",
};

//Images
export const images = {
  //splash
  location: require("../assets/tabIcons/pin.png"),
  add: require("../assets/tabIcons/add.png"),
  mark: require("../assets/tabIcons/qMark.png"),
  profile: require("../assets/tabIcons/account.png"),
  chat: require("../assets/tabIcons/chat.png"),
  backgroundImg: require("../assets/2.png"),
  abackgroundImg: require("../assets/4.png"),
  timer: require("../assets/timer.png"),
  calendar: require("../assets/calendar.png"),
  photo: require("../assets/photo.png"),
  couple: require("../assets/couple.png"),
  child: require("../assets/child.png"),
  user: require("../assets/user.png"),
  cart: require("../assets/cart.png"),
  arrow: require("../assets/back.png"),
  send: require("../assets/send.png"),
  search: require("../assets/search.png"),
};

export const navThemeConstants = {
  light: {
    backgroundColor: "#fff",
    fontColor: "#000",
    headerStyleColor: "#E8E8E8",
    iconBackground: "#F4F4F4",
  },
  dark: {
    backgroundColor: "#000",
    fontColor: "#fff",
    headerStyleColor: "E8E8E8",
    iconBackground: "#e6e6f2",
  },
};

export const fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 22,
  middle: 16,
  normal: 14,
  small: 12,
  xsmall: 10,
};

export const sizeSet = {
  tabIcon: {
    width: 32,
    height: 25,
    resizeMode: "contain",
  },
};

export const hitArea = {
  hitArea: { top: 20, bottom: 20, left: 80, right: 80 },
};

export const layout = {
  screenSpace: 20,
  screenSpaceBottom: 20,
};

export const styleSet = {
  backArrowStyle: {
    resizeMode: "contain",
    width: 18,
    height: 16,
    alignSelf: "center",
  },
};

export const userType = {
  normal: 2,
};

export const responseCode = {
  success: 200,
  error: 400,
  authenticated: 401,
  forbidden: 403,
  notFound: 404,
  serverError: 500,
};

export const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const places = ["", "Home", "Bar", "Other", "Other"];

export const USERS = "users";
export const REQUEST_TABLE = "tours";
export const REQUESTS = "requests";
export const CHATS_TABLE = "chat";
export const CHATS_ROOM = "chat_rooms";
export const TOURS_REQUEST = "requests";

export const cities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "سلطانة",
  "الدمام",
  "الطائف",
  "تبوك",
  "الخرج",
  "بريدة",
  "خميس مشيط",
  "الهفوف",
  "المبرز",
  "حفر الباطن",
  "حائل",
  "نجران",
  "الجبيل",
  "أبها",
  "ينبع",
  "الخبر",
  "عنيزة",
  "عرار",
  "سكاكا",
  "جازان",
  "القريات",
  "الظهران",
  "القطيف",
  "الباحة",
];

export const ages = ["عائلية", "كبار"];

const brdrWidth = 1;
const no_brdrWidth = 0;

export const imagePickerConfig = {
  aspect: [4, 3],
  maxWidth: 400,
  maxHeight: 300,
  quality: 0.1,
};

const debug = true;

export const highlights = {
  brdr1: debug ? { borderWidth: brdrWidth, borderColor: colors.red } : {},
  brdr01: {},
  brdr2: debug ? { borderWidth: brdrWidth, borderColor: colors.blue } : {},
  brdr02: {},

  brdr3: debug ? { borderWidth: brdrWidth, borderColor: colors.green } : {},
  brdr03: {},
  brdr4: debug ? { borderWidth: brdrWidth, borderColor: colors.orange } : {},
  brdr04: {},
  brdr5: debug ? { borderWidth: brdrWidth, borderColor: colors.grey } : {},
  brdr05: {},
  brdr6: debug ? { borderWidth: brdrWidth, borderColor: colors.greyLight } : {},
  brdr06: {},
  brdr7: debug ? { borderWidth: brdrWidth, borderColor: colors.greyDark } : {},
  brdr07: {},
  brdr8: debug ? { borderWidth: brdrWidth, borderColor: colors.blueDark } : {},
  brdr08: {},
  brdr9: debug
    ? { borderWidth: brdrWidth, borderColor: colors.blueBeryline }
    : {},
  brdr09: {},
};

export const no_highlights = {
  brdr1: {
    borderWidth: no_brdrWidth,
    borderColor: colors.red,
  },
  brdr2: {
    borderWidth: no_brdrWidth,
    borderColor: colors.blue,
  },
  brdr3: {
    borderWidth: no_brdrWidth,
    borderColor: colors.green,
  },
  brdr4: {
    borderWidth: no_brdrWidth,
    borderColor: colors.orange,
  },
  brdr5: {
    borderWidth: no_brdrWidth,
    borderColor: colors.grey,
  },
  brdr6: {
    borderWidth: no_brdrWidth,
    borderColor: colors.greyLight,
  },
  brdr7: {
    borderWidth: no_brdrWidth,
    borderColor: colors.greyDark,
  },
  brdr8: {
    borderWidth: no_brdrWidth,
    borderColor: colors.blueDark,
  },
  brdr9: {
    borderWidth: no_brdrWidth,
    borderColor: colors.blueBeryline,
  },
};

export const uploadImage = async (path) => {
  try {
    const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
    const response = await fetch(uri);
    const storage = getStorage();

    const fileName = uri.substring(uri.lastIndexOf("/") + 1);
    const blobFile = await response.blob();

    const reference = ref(storage, `media/${Date.now()}-${fileName}`);

    const result = await uploadBytesResumable(reference, blobFile);
    const url = await getDownloadURL(result.ref);
    // console.log("🚀 ~ url", url);

    return url;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const PaymentAllownceTime = new Date().setHours(
  new Date().getHours() - 6
);

import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Alert, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import * as yup from "yup";
import AppButton from "../../component/AppButton";
import ActivityForm from "../../component/forms/ActivityForm";
import TourForm from "../../component/forms/TourForm";
import Loading from "../../component/Loading";
import TabsWrapper from "../../component/TabsWrapper";
import {
  ages,
  cities,
  colors,
  highlights,
  imagePickerConfig,
  images,
  screenWidth,
  uploadImage,
} from "../../config/Constant";
import { db } from "../../config/firebase";
import { getUserId, getUserObj, insertTour } from "../../network/ApiService";
import text from "../../style/text";
import {
  isTime1After2,
  isTime1Before2,
  isTime1Equal2,
  logObj,
} from "../../util/DateHelper";
const activitySchema = yup.object({
  // max:25, min:5 , required, only characters and arabic and spaces
  title: yup
    .string("يجب أن يحتوي عنوان الجولة على حروف فقط")
    .min(5, "يجب أن يكون عنوان الجولة أكثر من 5 أحرف")
    .max(25, "يجب أن يكون عنوان الجولة أقل من 25 حرف")
    .matches(
      /^[a-zA-Z\u0600-\u06FF ]+$/,
      "يجب أن يحتوي عنوان الجولة على حروف فقط"
    )
    .required("يجب إدخال عنوان الجولة"),

  // max:150, min:25 , required
  description: yup
    .string()
    .min(25, "يجب أن يكون وصف الجولة أكثر من 25 حرف")
    .max(150, "يجب أن يكون وصف الجولة أقل من 150 حرف")
    .required("يجب إدخال وصف الجولة"),

  city: yup.string().required("يجب إدخال مدينة الجولة"),
  qty: yup
    .mixed()
    .required("يجب إدخال عدد الأشخاص المسموح لهم بالمشاركة في الجولة")
    .test(
      "is-num",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة رقماً إنجليزيًا",
      (value) => {
        return !isNaN(value);
      }
    )
    // check if qty is integer
    .test(
      "is-int",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة رقماً صحيحاً",
      (value) => Number.isInteger(Number(value))
    )
    .test(
      "min-qty",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة أكبر من 1",
      (value) => {
        return value > 0;
      }
    )
    // max:100, min:5 , required, only integers and english
    .test(
      "max-qty",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة أقل من 100",
      (value) => {
        return value < 100;
      }
    ),

  // Age --------------------------------
  age: yup.string().required("يجب إدخال الفئة العمرية المناسبة للجولة"),
  imageUrl: yup.string().nullable().required("يجب اختيار صورة للجولة"),
  date: yup.mixed().required("يجب إدخال تاريخ بدء الجولة"),

  startTime: yup
    .mixed()
    .required("يجب إدخال وقت بدء الجولة")
    // start time and end time are not the same
    .test(
      "is-start-time-not-equal-end-time",
      "يجب أن يكون وقت بدء الجولة مختلف عن وقت نهايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;

        const test =
          !!startTime && !!endTime ? !isTime1Equal2(startTime, endTime) : true;

        return test;
      }
    )
    // start time is before end time
    .test(
      "is-start-time-before-end-time",
      "يجب أن يكون وقت بدء الجولة قبل وقت نهايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;
        // true means valid
        const test =
          !!startTime && !!endTime ? isTime1Before2(startTime, endTime) : true;

        return test;
      }
    ),
  endTime: yup
    .mixed()
    .required("يجب إدخال وقت نهاية الجولة")
    //  end time and start time are not the same
    .test(
      "is-end-time-not-equal-start-time",
      "يجب أن يكون وقت نهاية الجولة مختلف عن وقت بدايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;
        const test =
          !!startTime && !!endTime ? !isTime1Equal2(endTime, startTime) : true;
        return test;
      }
    )
    // end time is after start time
    .test(
      "is-end-time-after-start-time",
      "يجب أن يكون وقت نهاية الجولة بعد وقت بدايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;

        const test =
          !!startTime && !!endTime ? isTime1After2(endTime, startTime) : true;
        return test;
      }
    ),

  meetingPoint: yup.mixed().required("يجب إدخال مكان لقاء الجولة"),
  activity: yup.object({
    // title => min:5 ,max:25 , required
    title: yup
      .string("يجب أن يحتوي عنوان النشاط على حروف فقط")
      .min(5, "يجب أن يكون عنوان النشاط أكثر من 5 أحرف")
      .max(25, "يجب أن يكون عنوان النشاط أقل من 25 حرف")
      .matches(
        /^[a-zA-Z\u0600-\u06FF ]+$/,
        "يجب أن يحتوي عنوان النشاط على حروف فقط"
      )
      .required("يجب إدخال عنوان النشاط"),

    // description => min:10 ,max:60 , required
    description: yup
      .string()
      .min(10, "يجب أن يكون وصف النشاط أكثر من 10 حرف")
      .max(60, "يجب أن يكون وصف النشاط أقل من 60 حرف")
      .required("يجب إدخال وصف النشاط"),
    location: yup.mixed().required("يجب إدخال موقع النشاط"),

    // location: yup
    //   .mixed("يجب إدخال موقع النشاط (يمكنك إضافة موقع النشاط لاحقاً)")
    //   .required("يجب إدخال موقع النشاط"),
    // startTime => required, min: tour start time, max: tour end time && activity start time < activity end time
    startTime: yup
      .mixed()
      .required("يجب إدخال وقت بدء النشاط")
      // tour end time and tour start time are exist ✅
      .test(
        "is-tour-end-time-and-tour-start-time-not-empty-act-start-time",
        "يجب إدخال وقت بدء ونهاية الجولة أولًا",
        function (value, context) {
          const { startTime: tourStartTime, endTime: tourEndTime } =
            context.from[1].value;
          // true means valid
          return !!tourStartTime && !!tourEndTime;
        }
      )
      // start time after tour start time ✅
      .test(
        "is-act-start-time-after-tour-start-time",
        "يجب أن يكون وقت بدء النشاط بعد وقت بدء الجولة",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: { startTime: activityStartTime },
          } = context.from[1].value;

          const test =
            !!tourStartTime && !!tourEndTime && !!activityStartTime
              ? isTime1After2(activityStartTime, tourStartTime)
              : true;

          return test;
        }
      )
      // start time before tour end time ✅
      .test(
        "is-act-start-time-before-tour-end-time",
        "يجب أن يكون وقت بدء النشاط قبل وقت نهاية الجولة",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: { startTime: activityStartTime },
          } = context.from[1].value;

          // both times are not empty
          if (!!tourStartTime && !!tourEndTime && !!activityStartTime) {
            const isActivityStartTimeBeforeTourEndTime = isTime1Before2(
              activityStartTime,
              tourEndTime
            );

            // activity start time is before tour end time
            if (isActivityStartTimeBeforeTourEndTime) {
              // true means valid
              return true;
            } else {
              // false means invalid
              return false;
            }
          } else {
            // true means valid
            return true;
          }
        }
      )
      // start time not equal to end time ✅
      .test(
        "is-act-start-time-not-equal-act-end-time",
        "يجب أن يكون وقت بدء النشاط مختلف عن وقت نهايته",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: {
              startTime: activityStartTime,
              endTime: activityEndTime,
            },
          } = context.from[1].value;

          // both times are not empty
          if (
            !!tourStartTime &&
            !!tourEndTime &&
            !!activityStartTime &&
            !!activityEndTime
          ) {
            // start time is not equal to end time
            return !isTime1Equal2(activityStartTime, activityEndTime);
          } else {
            // true means valid
            return true;
          }
        }
      )
      // start time before end time ✅
      .test(
        "is-act-start-time-before-act-end-time",
        "يجب أن يكون وقت بدء النشاط قبل وقت نهايته",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: {
              startTime: activityStartTime,
              endTime: activityEndTime,
            },
          } = context.from[1].value;

          // both times are not empty
          if (
            !!tourStartTime &&
            !!tourEndTime &&
            !!activityStartTime &&
            !!activityEndTime
          ) {
            // start time is before end time
            const isStartTimeBeforeEndTime = isTime1Before2(
              activityStartTime,
              activityEndTime
            );

            // start time is before end time
            if (isStartTimeBeforeEndTime) {
              // true means valid
              return true;
            } else {
              // false means invalid
              return false;
            }
          } else {
            // true means valid
            return true;
          }
        }
      ),

    // endTime => required, min: tour start time, max: tour end time && activity start time < activity end time
    endTime: yup
      .mixed()
      .required("يجب إدخال وقت نهاية النشاط")
      // tour end and tour start are exist ⌛
      .test(
        "is-tour-end-time-and-tour-start-time-not-empty-act-end-time",
        "يجب إدخال وقت بدء ونهاية الجولة أولاً",
        function (value, context) {
          const { startTime: tourStartTime, endTime: tourEndTime } =
            context.from[1].value;

          // both times are not empty
          // true means valid
          // false means invalid
          return !!tourStartTime && !!tourEndTime;
        }
      )
      // end time after tour start time ✅
      .test(
        "is-act-end-time-after-tour-start-time",
        "يجب أن يكون وقت نهاية النشاط بعد وقت بدء الجولة",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: { endTime: activityEndTime },
          } = context.from[1].value;

          const test =
            !!tourStartTime && !!tourEndTime && !!activityEndTime
              ? isTime1After2(activityEndTime, tourStartTime)
              : true;
          return test;
        }
      )

      // end time before tour end time ✅
      .test(
        "is-act-end-time-before-tour-end-time",
        "يجب أن يكون وقت نهاية النشاط قبل وقت نهاية الجولة",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: { endTime: activityEndTime },
          } = context.from[1].value;

          // both times are not empty
          if (!!tourStartTime && !!tourEndTime && !!activityEndTime) {
            const isEndTimeBeforeTourEndTime = isTime1Before2(
              activityEndTime,
              tourEndTime
            );

            if (isEndTimeBeforeTourEndTime) {
              // true means valid
              return true;
            } else {
              // false means invalid
              return false;
            }
          }
          // true means valid
          return true;
        }
      )
      // end time and start time are not equal ✅
      .test(
        "is-act-end-time-equal-act-start-time",
        "يجب أن يكون وقت نهاية النشاط مختلف عن وقت بدءه",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: {
              startTime: activityStartTime,
              endTime: activityEndTime,
            },
          } = context.from[1].value;

          // both times are not empty
          if (
            !!tourStartTime &&
            !!tourEndTime &&
            !!activityStartTime &&
            !!activityEndTime
          ) {
            // end time is before activity start time
            // true means valid
            // false means invalid
            return !isTime1Equal2(activityEndTime, activityStartTime);
          }
          // true means valid
          return true;
        }
      )
      // end time after activity start time ✅
      .test(
        "is-act-end-time-after-act-start-time",
        "يجب أن يكون وقت نهاية النشاط بعد وقت بدءه",
        function (value, context) {
          const {
            startTime: tourStartTime,
            endTime: tourEndTime,
            activity: {
              startTime: activityStartTime,
              endTime: activityEndTime,
            },
          } = context.from[1].value;

          const test =
            !!tourStartTime &&
            !!tourEndTime &&
            !!activityStartTime &&
            !!activityEndTime
              ? isTime1After2(activityEndTime, activityStartTime)
              : true;

          return test;
        }
      ),

    price: yup
      .string()
      .nullable()
      .required("يجب إدخال سعر النشاط")
      .test(
        "is-price-valid",
        "يجب أن يكون سعر النشاط رقم صحيح",
        function (value, context) {
          const { price } = context.from[1].value.activity;
          const test = !!price ? !!Number(price) : true;
          return test;
        }
      )
      // price is not negative
      .test(
        "is-price-not-negative",
        "يجب أن يكون سعر النشاط رقم صحيح ولا يقل عن 0",
        function (value, context) {
          const { price } = context.from[1].value.activity;
          const test = !!price ? Number(price) >= 0 : true;
          return test;
        }
      ),

    // imageUrl => required
    imageUrl: yup.string().nullable().required("يجب إدخال صورة النشاط"),
  }),
});

const tourSchema = yup.object({
  // max:25, min:5 , required, only characters and arabic and spaces
  title: yup
    .string("يجب أن يحتوي عنوان الجولة على حروف فقط")
    .min(5, "يجب أن يكون عنوان الجولة أكثر من 5 أحرف")
    .max(25, "يجب أن يكون عنوان الجولة أقل من 25 حرف")
    .matches(
      /^[a-zA-Z\u0600-\u06FF ]+$/,
      "يجب أن يحتوي عنوان الجولة على حروف فقط"
    )
    .required("يجب إدخال عنوان الجولة"),

  // max:150, min:25 , required
  description: yup
    .string()
    .min(25, "يجب أن يكون وصف الجولة أكثر من 25 حرف")
    .max(150, "يجب أن يكون وصف الجولة أقل من 150 حرف")
    .required("يجب إدخال وصف الجولة"),

  city: yup.string().required("يجب إدخال مدينة الجولة"),
  qty: yup
    .mixed()
    .required("يجب إدخال عدد الأشخاص المسموح لهم بالمشاركة في الجولة")
    .test(
      "is-num",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة رقماً إنجليزيًا",
      (value) => {
        return !isNaN(value);
      }
    )
    // check if qty is integer
    .test(
      "is-int",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة رقماً صحيحاً",
      (value) => Number.isInteger(Number(value))
    )
    .test(
      "min-qty",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة أكبر من 1",
      (value) => {
        return value > 0;
      }
    )
    // max:100, min:5 , required, only integers and english
    .test(
      "max-qty",
      "يجب أن يكون عدد الأشخاص المسموح لهم بالمشاركة في الجولة أقل من 100",
      (value) => {
        return value < 100;
      }
    ),

  age: yup.string().required("يجب إدخال الفئة العمرية المناسبة للجولة"),
  imageUrl: yup.string().nullable().required("يجب اختيار صورة للجولة"),
  date: yup.mixed().required("يجب إدخال تاريخ بدء الجولة"),

  startTime: yup
    .mixed()
    .required("يجب إدخال وقت بدء الجولة")
    // start time and end time are not the same
    .test(
      "is-start-time-not-equal-end-time",
      "يجب أن يكون وقت بدء الجولة مختلف عن وقت نهايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;

        const test =
          !!startTime && !!endTime ? !isTime1Equal2(startTime, endTime) : true;

        return test;
      }
    )
    // start time is before end time
    .test(
      "is-start-time-before-end-time",
      "يجب أن يكون وقت بدء الجولة قبل وقت نهايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;
        // true means valid
        const test =
          !!startTime && !!endTime ? isTime1Before2(startTime, endTime) : true;

        return test;
      }
    ),
  endTime: yup
    .mixed()
    .required("يجب إدخال وقت نهاية الجولة")
    //  end time and start time are not the same
    .test(
      "is-end-time-not-equal-start-time",
      "يجب أن يكون وقت نهاية الجولة مختلف عن وقت بدايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;
        const test =
          !!startTime && !!endTime ? !isTime1Equal2(endTime, startTime) : true;
        return test;
      }
    )
    // end time is after start time
    .test(
      "is-end-time-after-start-time",
      "يجب أن يكون وقت نهاية الجولة بعد وقت بدايتها",
      function (value, context) {
        const { startTime, endTime } = context.from[0].value;

        const test =
          !!startTime && !!endTime ? isTime1After2(endTime, startTime) : true;
        return test;
      }
    ),

  meetingPoint: yup.mixed().required("يجب إدخال مكان لقاء الجولة"),
});

const tabs = [
  { title: "الجولة", selected: false },
  { title: "الأنشطة", selected: false },
];

const initActivity = {
  id: null,
  title: "",
  description: "",
  location: null,
  startTime: null,
  endTime: null,
  price: null,
  imageUrl: null,
};

const initTour = {
  title: "",
  city: "",
  qty: 0,
  meetingPoint: null,
  // {
  // address: "",
  // coordinates: {
  //   latitude: 0,
  //   longitude: 0,
  // },
  // category: [],
  // full_name: "",
  // title: "",
  // id: "",
  // }
  age: "",
  description: "",
  imageUrl: null,
  date: null,
  startTime: null,
  endTime: null,
  status: 0,
  activitiesCustomizable: false,
  activity: initActivity,
  activities: [],
  price: 0,
};

const PostTourV2 = ({ navigation }) => {
  const [activitiesMode, setActivitiesMode] = useState("idle"); // add, edit, idle
  // Form State
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isDirty,
      isSubmitted,
      dirtyFields,
      touchedFields,
      isSubmitting,
      submitCount,
      isSubmitSuccessful,
      isValidating,
      defaultValues,
    },
    setValue,
    trigger,
    reset,
    resetField,
    getValues,
    watch,
    getFieldState,
  } = useForm({
    defaultValues: {
      ...initTour,
    },
    resolver: yupResolver(
      activitiesMode === "idle" ? tourSchema : activitySchema
    ),
    mode: "onBlur",
  });

  // Page State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const DEFAULT_TABBAR_HEIGHT = useBottomTabBarHeight();

  // Tour
  const [tour, setTour] = useState(initTour);
  const [filePathTour, setFilePathTour] = useState(null);

  // Activity
  const [activity, setActivity] = useState(initActivity);
  const [activities, setActivities] = useState(tour.activities);
  false && logObj(activity, "activity");

  // Modals Refs and configs
  const modalizeRef = useRef(null);
  const modalizeRefAge = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerConfig, setPickerConfig] = useState("date"); // date, startTime, endTime

  const [currentUserId, setCurrentUserId] = useState(null);

  const getCurrentUser = async () => {
    const user = await getUserId();
    setCurrentUserId(user);
    return user;
  };
  useEffect(() => {
    getCurrentUser();
    return () => {};
  }, []);

  const reseter = () => {
    setTour(initTour);
    setActivity(initActivity);
    setFilePathTour(null);
    setActivities([]);
  };

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const openDatePicker = (type) => {
    setPickerConfig(type);

    // trigger activity start time and end time
    // trigger()
    trigger("date");
    trigger("startTime");
    trigger("endTime");
    trigger("activity.startTime");
    trigger("activity.endTime");

    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    setDatePickerVisibility(false);

    if (pickerConfig === "date") {
      setTour({ ...tour, date: date });
      setValue("date", date);
    }
    if (pickerConfig === "startTime") {
      setTour({ ...tour, startTime: date });
      setValue("startTime", date);
    }
    if (pickerConfig === "endTime") {
      setTour({ ...tour, endTime: date });
      setValue("endTime", date);
    }

    if (pickerConfig === "activityStartTime") {
      setActivity({ ...activity, startTime: date });
      setValue("activity.startTime", date);
    }
    if (pickerConfig === "activityEndTime") {
      setActivity({ ...activity, endTime: date });
      setValue("activity.endTime", date);
    }
    trigger("date");

    trigger("startTime");
    trigger("endTime");
    trigger("activity.startTime");
    trigger("activity.endTime");
  };

  // Modal
  const onShowModal = (type) => {
    if (type === "city") {
      trigger("city");
      modalizeRef.current?.open();
    }
    if (type === "age") {
      trigger("age");
      modalizeRefAge.current?.open();
    }
  };
  const selectModal = (type, value) => {
    if (type === "city") {
      setTour({ ...tour, city: value });
      setValue("city", value);
      modalizeRef.current?.close();
      trigger("city");
    }
    if (type === "age") {
      setTour({ ...tour, age: value });
      setValue("age", value);
      modalizeRefAge.current?.close();
      trigger("age");
    }
  };

  // Activity methods
  const onAddActivity = () => {
    const curActLoc = activity?.location;

    // validate location
    const ActLoc = {
      address: curActLoc.address || "",
      title: curActLoc.title || "",
      category: curActLoc.category || [],
      full_name: curActLoc.full_name || "",
      coordinates: {
        latitude: curActLoc.coordinates?.latitude || 0,
        longitude: curActLoc.coordinates?.longitude || 0,
      },
      id: curActLoc.id || "",
    };

    const act = {
      ...activity,
      id: activities.length + 1,
      location: ActLoc,
    };

    const isTitleExist = activities.find(
      (a) => a.title === activities.title && a.id !== activity.id
    );
    console.log("🚀 ~ isTitleExist", isTitleExist);
    if (isTitleExist) {
      Alert.alert(
        "خطأ",
        "الرجاء اختيار عنوان آخر للنشاط، لأنه موجود بالفعل في نشاط آخر"
      );
      return;
    }

    setActivities([...activities, act]);
    setActivitiesMode("idle");
    setActivity(initActivity);
    resetField("activity");
    // reset(
    //   {
    //     activity: initActivity,
    //   },
    // );
  };
  const onRemoveActivity = (id) => {
    setActivities(activities.filter((act) => act.id !== id));
  };
  const onEditActivity = (id) => {
    setActivitiesMode("edit");
    const activityToEdit = activities.find((a) => a.id === id);
    setActivity(activityToEdit);
    setValue("activity", activityToEdit);
  };
  const onEditActivitySubmit = () => {
    // check if title is added to another activity
    const isTitleExist = activities.find(
      (a) => a.title === activities.title && a.id !== activity.id
    );
    if (isTitleExist) {
      Alert.alert(
        "خطأ",
        "الرجاء اختيار عنوان آخر للنشاط، لأنه موجود بالفعل في نشاط آخر"
      );
      return;
    }

    const index = activities.findIndex((a) => a.id === activity.id);
    const newActivities = [...activities];
    newActivities[index] = activity;
    setActivities(newActivities);
    setActivitiesMode("idle");
    setActivity(initActivity);
    setValue("activity", initActivity);
  };
  const onEditActivityCancel = () => {
    setActivitiesMode("idle");
    setActivity(initActivity);
    setValue("activity", initActivity);
  };
  const onRemoveActivitySubmit = () => {
    setActivities(activities.filter((a) => a.id !== activity.id));
    setActivitiesMode("idle");
    setActivity(initActivity);
    setValue("activity", initActivity);
  };

  // Image Picker & Tour
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      ...imagePickerConfig,
    });
    if (!result.canceled) {
      const theUrl = result.assets[0].uri;
      setFilePathTour(theUrl);
      setValue("imageUrl", theUrl);
      trigger("imageUrl");
    }
  };

  const submitRequest = async () => {
    try {
      setIsLoading(true);
      setModalVisible(!isModalVisible);

      // TODO: check if name is duplicated in firebase
      // tours collection
      const q = query(
        collection(db, "tours"),
        where("title", "==", getValues().title),
        // localId current user
        where("localId", "==", currentUserId)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        setIsLoading(false);
        setModalVisible(!isModalVisible);
        return Alert.alert(
          "يوجد جولة بنفس الاسم",
          "الرجاء تغيير اسم الجولة",
          [
            {
              text: "حسنا",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }

      const uploadedImage = await uploadImage(filePathTour);
      const { uid: userId, firstname } = await getUserObj();

      // validate meeting point Address
      const validatedMeetingPoint = {
        ...tour.meetingPoint,
        address: tour.meetingPoint.address || "",
      };

      if (!!uploadedImage) {
        let data = {
          ...getValues(),
          imageUrl: uploadedImage,
          meetingPoint: validatedMeetingPoint,
          activities: activities,
          requestBy: userId,
          localName: firstname,
          dateCreated: Date.now(),
          dateUpdated: null,
          status: 0,
          isPaid: false,
        };

        delete data.activity;

        !!false && logObj(data, "data");
        !false && (await insertTour(data));
        setIsLoading(false);
        false && navigation.goBack();
      }

      // setLoading(false);
      // navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      alert("حدث خطأ ما، الرجاء المحاولة مرة أخرى");
      console.log("error submitRequest", error);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 0:
        return (
          <TourForm
            tour={tour}
            isModalVisible={isModalVisible}
            openDatePicker={openDatePicker}
            handleConfirm={handleConfirm}
            pickImage={pickImage}
            filePathTour={filePathTour}
            setFilePathTour={setFilePathTour}
            isDatePickerVisible={isDatePickerVisible}
            onShowModal={onShowModal}
            selectModal={selectModal}
            setTour={setTour}
            // form state
            control={control}
            handleSubmit={handleSubmit}
            reset={reset}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            trigger={trigger}
          />
        );
      case 1:
        return (
          <ActivityForm
            mode={activitiesMode}
            //
            activity={activity}
            activities={activities}
            setActivity={setActivity}
            activitiesMode={activitiesMode}
            setActivitiesMode={setActivitiesMode}
            activitiesCustomizable={tour.activitiesCustomizable}
            setTour={setTour}
            //
            isModalVisible={isModalVisible}
            openDatePicker={openDatePicker}
            handleConfirm={handleConfirm}
            isDatePickerVisible={isDatePickerVisible}
            //
            onAddActivity={onAddActivity}
            onRemoveActivity={onRemoveActivity}
            onEditActivity={onEditActivity}
            //
            onRemoveActivitySubmit={onRemoveActivitySubmit}
            onEditActivitySubmit={onEditActivitySubmit}
            onEditActivityCancel={onEditActivityCancel}
            // form state
            control={control}
            handleSubmit={handleSubmit}
            reset={reset}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            trigger={trigger}
          />
        );
      default:
        return <TourForm />;
    }
  };

  // const errorsWithOutActivity = Object.keys(errors).filter(
  //   (key) => key !== "activities"
  // );

  // const enablePost =
  //   errorsWithOutActivity.length === 0 && activities.length > 0;

  const enablePost =
    isDirty &&
    errors &&
    Object.keys(errors).length === 0 &&
    activities.length > 0;

  !false && logObj(errors, "error");
  // console.log("🚀 ~ activities.length", activities.length);

  return (
    <View style={styles.container}>
      <Loading text="جاري نشر الجولة..." visible={isLoading} />
      {/* Body */}
      <ImageBackground
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: screenWidth.width100,
          height: Dimensions.get("window").height,
          alignItems: "center",
          justifyContent: "center",
        }}
        source={images.backgroundImg}
        resizeMode="cover"
      >
        <View
          style={{
            // flex: 1,
            height: "99%",
          }}
        >
          {/* Header */}
          <View
            style={{
              alignItems: "center",
              marginTop: screenWidth.width10,
              // marginVertical: 0,
            }}
          >
            <View style={styles.headerContaner}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.headerText}>نشر جولة جديدة</Text>
                <AppButton
                  disabled={!enablePost}
                  style={{
                    // ...styles.button,
                    height: 40,
                    width: 60,
                    ...styles.shadow,
                  }}
                  title={"نشر"}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                />
              </View>
            </View>
            <TabsWrapper
              menuTabs={tabs}
              onPressTab={onPressTab}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          </View>

          {/* Body */}
          <KeyboardAwareScrollView
            enableAutomaticScroll
            extraHeight={240}
            enableOnAndroid
            contentContainerStyle={{
              width: "100%",
            }}
            showsVerticalScrollIndicator={false}
            keyboardOpeningTime={400}
          >
            {renderContent()}
          </KeyboardAwareScrollView>

          {/* BTNS */}
          <View
            style={{
              ...highlights.brdr01,
              marginTop: screenWidth.width2,
              marginBottom:
                Platform.OS === "ios"
                  ? DEFAULT_TABBAR_HEIGHT - 6
                  : DEFAULT_TABBAR_HEIGHT - 22,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activities.length == 0 && selectedMenu == "0" ? (
              <AppButton
                alwaysEnabled
                style={{
                  ...styles.button,
                  ...styles.shadow,

                  width: screenWidth.width80,
                  height: 60,
                }}
                error={
                  !enablePost
                    ? Object.keys(errors).length > 0
                      ? "يجب إدخال جميع البيانات المطلوبة بشكل صحيح"
                      : ""
                    : ""
                }
                title={"أضف نشاط"}
                onPress={() => {
                  // move to activity tab
                  onPressTab(1);
                }}
              />
            ) : (
              <AppButton
                disabled={!enablePost}
                style={{
                  ...styles.button,
                  ...styles.shadow,

                  width: screenWidth.width80,
                  height: 60,
                }}
                error={
                  !enablePost
                    ? Object.keys(errors).length > 0
                      ? "يجب إدخال جميع البيانات المطلوبة بشكل صحيح"
                      : activities.length === 0
                      ? "يجب إضافة نشاط واحد على الأقل"
                      : ""
                    : ""
                }
                title={"نشر"}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            )}
          </View>
        </View>
      </ImageBackground>

      {/* Modal & Picker & Sheets */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        collapsable={true}
        animationType="fade"
      >
        <View style={[styles.modalView]}>
          <View style={[styles.main]}>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text22,
                  { textAlign: "center" },
                ]}
              >
                هل أنت متأكد أنك تريد نشر هذه الجولة؟
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <AppButton
                title="نشر"
                onPress={handleSubmit(submitRequest)}
                style={{ width: "45%", height: 55 }}
              />
              <AppButton
                title="الغاء"
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  width: "45%",
                  height: 55,
                  backgroundColor: colors.apple,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={
          pickerConfig === "date" || pickerConfig === "activityDate"
            ? "date"
            : "time"
        }
        date={
          pickerConfig === "date"
            ? tour.date || new Date()
            : pickerConfig === "startTime"
            ? tour.startTime || new Date()
            : pickerConfig === "endTime"
            ? tour.endTime || new Date()
            : pickerConfig === "activityDate"
            ? activity.date || new Date()
            : pickerConfig === "activityStartTime"
            ? activity.startTime || new Date()
            : pickerConfig === "activityEndTime"
            ? activity.endTime || new Date()
            : new Date()
        }
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={
          pickerConfig === "date" || pickerConfig === "activityDate"
            ? new Date()
            : null
        }
        nativeID="datePicker"
      />
      <RBSheet ref={modalizeRef} height={screenWidth.width80}>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            alignSelf: "center",
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          {cities.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sheetText]}
              onPress={() => selectModal("city", value)}
              style={{
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.grey,
                borderBottomWidth: 1,
                borderTopWidth: index === 0 ? 1 : 0,
              }}
            >
              <Text
                style={[
                  {
                    fontWeight: "bold",
                  },
                  text.black,
                  text.text20,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </RBSheet>
      <RBSheet ref={modalizeRefAge} height={screenWidth.width50}>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            alignSelf: "center",
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          {ages.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sheetText]}
              onPress={() => selectModal("age", value)}
              style={{
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                borderColor: colors.grey,
                borderBottomWidth: 1,
                borderTopWidth: index === 0 ? 1 : 0,
              }}
            >
              <Text
                style={[
                  text.black,
                  text.text20,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </RBSheet>
      <StatusBar style="auto" />
    </View>
  );
};

export default PostTourV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContaner: {
    // flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    width: screenWidth.width90,
    marginTop: 10,
    ...highlights.brdr01,
  },
  headerText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
    width: "75%",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  main: {
    backgroundColor: "#fff",
    // width: screenWidth.width80,
    // backgroundColor: "red",
    padding: 20,
    borderRadius: 20,
  },
  button: {
    height: 55,
    width: "90%",
    // marginBottom: 200,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 29,
  },

  shadow: {
    // drop top shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // drop bottom shadow
    elevation: 5,
  },
});

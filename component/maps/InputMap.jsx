import React, { memo, useCallback, useRef, useState } from "react";
import { Dimensions, Platform, Text, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { v4 as uuidv4 } from "uuid";

import Feather from "react-native-vector-icons/Feather";
import { colors } from "../../config/Constant";
import { splitString } from "../../util/CustomHelper";
import Chip from "../Chip";
Feather.loadFont();

// map
const mapUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const access_token =
  ".json?access_token=pk.eyJ1IjoicmVlbTI2MzIxIiwiYSI6ImNsZDNwYXo0dDA2Ynozb3FwM283N2o0Y2IifQ.fyeX-zZcmcBPLqXbnzit0g";
const limit = "&limit=5";
const fuzzyMatch = "&fuzzyMatch=true";
const types = "&types=address";

const language = "&language=ar";
const country = "&country=SA";

// search
const searchUrl = "https://api.mapbox.com/search/v1/suggest/";
const search_token =
  "?access_token=pk.eyJ1IjoicmVlbTI2MzIxIiwiYSI6ImNsZDNwYXo0dDA2Ynozb3FwM283N2o0Y2IifQ.fyeX-zZcmcBPLqXbnzit0g";
const session_token = "&session_token=" + uuidv4();

const ListItemComponent = ({ item, index }) => {
  const { id, title, full_name, address, category } = item;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        {/* Title & category */}
        <View
          style={{
            flex: 1,
            flexDirection: "row-reverse",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.themeDefault,
            }}
          >
            {title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              // flex: 1,
              // flexWrap: "wrap",
            }}
          >
            {category &&
              category?.map((item, index) => <Chip key={index} text={item} />)}
          </View>
        </View>
        {/* Full Name */}
        <Text style={{ fontSize: 14, color: colors.greyDark }}>
          {full_name}
        </Text>

        {/* Address */}
        {address && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather
              name="map"
              size={12}
              color={colors.facebook}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 14, color: colors.greyDark }}>
              {address}
            </Text>
          </View>
        )}
      </View>
      <View style={{ width: 50, alignItems: "center" }}>
        <Feather name="map-pin" size={30} color={colors.facebook} />
      </View>
    </View>
  );
};

export const InputMap = memo(
  ({
    placeholder,
    value,
    onSelectLocation,
    onClearLocation,
    style,
    ...props
  }) => {
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState(null);
    const [query, setQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownController = useRef(null);

    const searchRef = useRef(null);

    const getSuggestions = useCallback(async (q) => {
      console.log("getSuggestions", q);
      setQuery(q);
      if (typeof q !== "string" || q.length < 3) {
        setSuggestionsList(null);
        return;
      }

      setLoading(true);
      const responseMapUrl = await fetch(
        mapUrl +
          q +
          access_token +
          // addons
          limit +
          country +
          fuzzyMatch +
          language

        // types
      );
      const itemsMapUrl = await responseMapUrl.json();

      // logObj(itemsMapUrl.features, "items");

      const suggestions = itemsMapUrl?.features?.map((item) => {
        const {
          id,
          text_ar,
          place_name_ar,
          center,
          properties: { address, category },
        } = item;

        return {
          id,
          title: text_ar,
          full_name: place_name_ar,
          address,
          coordinates: {
            latitude: center[1],
            longitude: center[0],
          },
          category: splitString(category, {
            separator: ",",
            limit: 2,
            removeEmpty: true,
            trim: true,
            convertToLowerCase: true,
            capitalizeFirstLetter: true,
          }),
        };
      });

      // logObj(suggestions, "suggestions");

      setSuggestionsList(suggestions);
      setLoading(false);
    }, []);

    const onClearPress = useCallback(() => {
      setQuery("");
      setSuggestionsList(null);
      onClearLocation && onClearLocation();
    }, []);

    const onOpenSuggestionsList = useCallback((isOpened) => {}, []);

    return (
      <>
        <View
          style={[
            { flex: 1, flexDirection: "row", alignItems: "center" },
            Platform.select({ ios: { zIndex: 1 } }),
            style,
          ]}
        >
          <AutocompleteDropdown
            direction={"up"}
            bottomOffset={Platform.select({ ios: 0, android: 100 })}
            ref={searchRef}
            controller={(controller) => {
              dropdownController.current = controller;
            }}
            // initialValue={'1'}
            direction={Platform.select({ ios: "down" })}
            dataSet={suggestionsList}
            onChangeText={getSuggestions}
            initialValue={value}
            onSelectItem={(item) => {
              if (item) {
                setSelectedItem(item);
                onSelectLocation && onSelectLocation(item);
              }
            }}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
            onClear={onClearPress}
            //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: "اكتب للبحث",
              autoCorrect: false,
              autoCapitalize: "none",
              style: {
                borderRadius: 25,
                backgroundColor: "#fff",
                color: "#000",
                paddingLeft: 18,
              },
            }}
            rightButtonsContainerStyle={{
              right: 8,
              height: 30,
              alignSelf: "center",
              flexDirection: "row-reverse",
            }}
            inputContainerStyle={{
              direction: "rtl",
              flexDirection: "row-reverse",
              // backgroundColor: "#383b42",
              backgroundColor: "#fff",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#5398a0",
              // ...no_highlights.brdr1,
            }}
            suggestionsListContainerStyle={{
              backgroundColor: "#fff",
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => <ListItemComponent item={item} />}
            ChevronIconComponent={
              <Feather
                name="chevron-down"
                size={20}
                color={colors.themeDefault}
              />
            }
            ClearIconComponent={
              <>
                {query && (
                  <Feather name="x-circle" size={18} color={colors.redTheme} />
                )}
              </>
            }
            inputHeight={50}
            showChevron
            // closeOnBlur
            showClear
            EmptyResultComponent={
              <View
                style={{
                  flex: 1,
                  flexDirection: "row-reverse",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    // flex: 1,
                    // width: "100%",
                  }}
                >
                  <Text
                    style={{
                      // textAlign: "center",
                      color: colors.themeDefault,
                      fontSize: 16,
                      fontWeight: "bold",
                      marginHorizontal: 10,
                      // ...no_highlights.brdr2,
                    }}
                  >
                    لا يوجد نتائج لهذا المكان
                  </Text>
                </View>
                {/* Icon */}
                <Feather name="search" size={30} color={colors.themeDefault} />
              </View>
            }
            {...props}
          />
        </View>
      </>
    );
  }
);
export default InputMap;

const res_features = [
  {
    id: "place.1018052",
    type: "Feature",
    place_type: ["place"],
    relevance: 1,
    properties: {
      wikidata: "Q3692",
    },
    text_ar: "الرياض",
    language_ar: "ar",
    place_name_ar: "الرياض، منطقة الرياض، السعودية",
    text: "الرياض",
    language: "ar",
    place_name: "الرياض، منطقة الرياض، السعودية",
    bbox: [45.009616, 24.213939, 47.731856, 25.22863],
    center: [46.716667, 24.633333],
    geometry: {
      type: "Point",
      coordinates: [46.716667, 24.633333],
    },
    context: [
      {
        id: "region.17604",
        short_code: "SA-01",
        wikidata: "Q1249255",
        text_ar: "منطقة الرياض",
        language_ar: "ar",
        text: "منطقة الرياض",
        language: "ar",
      },
      {
        id: "country.8900",
        short_code: "sa",
        wikidata: "Q851",
        text_ar: "السعودية",
        language_ar: "ar",
        text: "السعودية",
        language: "ar",
      },
    ],
  },
  {
    id: "poi.627065321381",
    type: "Feature",
    place_type: ["poi"],
    relevance: 1,
    properties: {
      foursquare: "4be866169a54a593b7ec0911",
      landmark: true,
      address: "King Fahad Rd",
      category: "mall, shop",
    },
    text_ar: "الرياض جاليري",
    language_ar: "ar",
    place_name_ar: "الرياض جاليري، King Fahad Rd، الرياض، السعودية",
    text: "الرياض جاليري",
    language: "ar",
    place_name: "الرياض جاليري، King Fahad Rd، الرياض، السعودية",
    center: [46.658474, 24.743148],
    geometry: {
      coordinates: [46.658474, 24.743148],
      type: "Point",
    },
    context: [
      {
        id: "place.1018052",
        wikidata: "Q3692",
        text_ar: "الرياض",
        language_ar: "ar",
        text: "الرياض",
        language: "ar",
      },
      {
        id: "region.17604",
        short_code: "SA-01",
        wikidata: "Q1249255",
        text_ar: "منطقة الرياض",
        language_ar: "ar",
        text: "منطقة الرياض",
        language: "ar",
      },
      {
        id: "country.8900",
        short_code: "sa",
        wikidata: "Q851",
        text_ar: "السعودية",
        language_ar: "ar",
        text: "السعودية",
        language: "ar",
      },
    ],
  },
  {
    id: "place.6129734",
    type: "Feature",
    place_type: ["place"],
    relevance: 1,
    properties: {
      wikidata: "Q1624154",
    },
    text_ar: "الرياض",
    language_ar: "ar",
    place_name_ar: "الرياض, مالقة, إسبانيا",
    text: "الرياض",
    language: "ar",
    place_name: "الرياض, مالقة, إسبانيا",
    bbox: [-5.159141, 36.779115, -5.108382, 36.813928],
    center: [-5.140746, 36.799142],
    geometry: {
      type: "Point",
      coordinates: [-5.140746, 36.799142],
    },
    context: [
      {
        id: "region.386118",
        short_code: "ES-MA",
        wikidata: "Q95028",
        text_ar: "مالقة",
        language_ar: "ar",
        text: "مالقة",
        language: "ar",
      },
      {
        id: "country.8774",
        short_code: "es",
        wikidata: "Q29",
        text_ar: "إسبانيا",
        language_ar: "ar",
        text: "إسبانيا",
        language: "ar",
      },
    ],
  },
  {
    id: "poi.747324378058",
    type: "Feature",
    place_type: ["poi"],
    relevance: 1,
    properties: {
      foursquare: "5c8e405998fbfc002c9ec022",
      landmark: true,
      address: "Prince Abdulaziz Ibn Thunayyan",
      category: "park",
      maki: "picnic-site",
    },
    text_ar: "بروتينك",
    language_ar: "ar",
    place_name_ar: "بروتينك، Prince Abdulaziz Ibn Thunayyan، الرياض، السعودية",
    text: "بروتينك",
    language: "ar",
    place_name: "بروتينك، Prince Abdulaziz Ibn Thunayyan، الرياض، السعودية",
    matching_text: "الرياض هب",
    matching_place_name:
      "الرياض هب، Prince Abdulaziz Ibn Thunayyan، الرياض، السعودية",
    center: [46.610533000000004, 24.732613999999998],
    geometry: {
      coordinates: [46.610533000000004, 24.732613999999998],
      type: "Point",
    },
    context: [
      {
        id: "place.1018052",
        wikidata: "Q3692",
        text_ar: "الرياض",
        language_ar: "ar",
        text: "الرياض",
        language: "ar",
      },
      {
        id: "region.17604",
        short_code: "SA-01",
        wikidata: "Q1249255",
        text_ar: "منطقة الرياض",
        language_ar: "ar",
        text: "منطقة الرياض",
        language: "ar",
      },
      {
        id: "country.8900",
        short_code: "sa",
        wikidata: "Q851",
        text_ar: "السعودية",
        language_ar: "ar",
        text: "السعودية",
        language: "ar",
      },
    ],
  },
  {
    id: "poi.455266573615",
    type: "Feature",
    place_type: ["poi"],
    relevance: 1,
    properties: {
      foursquare: "4dab12f5a86e771ea7313822",
      landmark: true,
      address: "Khalid Ibn Al-Walid St.",
      category: "mall, shop",
    },
    text_ar: "الرياض مول",
    language_ar: "ar",
    place_name_ar: "الرياض مول، Khalid Ibn Al-Walid St.، الرياض، السعودية",
    text: "الرياض مول",
    language: "ar",
    place_name: "الرياض مول، Khalid Ibn Al-Walid St.، الرياض، السعودية",
    center: [46.783615, 24.737365],
    geometry: {
      coordinates: [46.783615, 24.737365],
      type: "Point",
    },
    context: [
      {
        id: "locality.1329860",
        text_ar: "الأندلس",
        language_ar: "ar",
        text: "الأندلس",
        language: "ar",
      },
      {
        id: "place.1018052",
        wikidata: "Q3692",
        text_ar: "الرياض",
        language_ar: "ar",
        text: "الرياض",
        language: "ar",
      },
      {
        id: "region.17604",
        short_code: "SA-01",
        wikidata: "Q1249255",
        text_ar: "منطقة الرياض",
        language_ar: "ar",
        text: "منطقة الرياض",
        language: "ar",
      },
      {
        id: "country.8900",
        short_code: "sa",
        wikidata: "Q851",
        text_ar: "السعودية",
        language_ar: "ar",
        text: "السعودية",
        language: "ar",
      },
    ],
  },
];

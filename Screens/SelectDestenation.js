import {
    TextField,
    Input,
    Icon,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Select,
  } from "@mui/material";
  import "./SelectDestination.css";
  
  const SelectDestination = () => {
    return (
      <div className="select-destination">
        <div className="rectangle-div2" />
        <img className="vuesaxbulkautobrightness-icon" alt="" />
        <a className="group-a">
          <div className="rectangle-div3" />
          <img
            className="vuesaxtwotonearrow-left-icon"
            alt=""
            src="../vuesaxtwotonearrowleft.svg"
          />
        </a>
        <h1 className="search-for-flights">Search for flights</h1>
        <div className="component-10">
          <div className="frame-div2">
            <div className="email">التاريخ</div>
          </div>
          <TextField
            className="frame-textfield"
            sx={{ width: 387.79046630859375 }}
            color="primary"
            variant="outlined"
            type="text"
            label="اختر تاريخا"
            placeholder="Placeholder"
            size="medium"
            margin="none"
          />
        </div>
        <div className="component-11">
          <div className="frame-div2">
            <div className="email">location</div>
          </div>
          <FormControl sx={{ width: 387.79046630859375 }} variant="outlined">
            <InputLabel color="primary">Select city</InputLabel>
            <Select color="primary" size="medium" label="اختر مدينة" />
            <FormHelperText />
          </FormControl>
        </div>
        <button className="frame-button">
          <div className="search-flights">ابحث عن رحلة</div>
        </button>
        <div className="homeindicator1">
          <div className="home-indicator1" />
        </div>
      </div>
    );
  };
  
  export default SelectDestination;
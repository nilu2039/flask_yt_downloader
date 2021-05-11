import React, { useState } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import "./AudioOnly.css";
import Button from "@material-ui/core/Button";
import { useGradientBtnStyles } from "@mui-treasury/styles/button/gradient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
require("dotenv").config();
const AudioOnly = ({ data, disabled, url }) => {
  const [selectedOption, setSelectedOption] = useState(`Select quality`);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [extension, setExtension] = useState("");
  const chubbyStyles = useGradientBtnStyles({ chubby: true });
  const setid = async (id, extension, quality) => {
    setId(id);
    setExtension(extension);
    setSelectedOption(quality);
    console.log(id);
  };

  const download = async () => {
    if (id) {
      setLoading(true);

      const baseUrl =
        process.env.NODE_ENV === "development"
          ? `http://localhost:5000/v1/api/download`
          : `/v1/api/download`;
      const { data } = await axios.post(baseUrl, {
        code: `${id}`,
        url: url,
      });
      window.location.href = data.url;
      setLoading(false);
    } else
      return toast("Select a valid format", {
        type: "error",
        position: "bottom-right",
      });
  };

  return (
    <div>
      <div className="menu_quality">
        <UncontrolledDropdown className="menu">
          {disabled ? (
            <DropdownToggle
              className="dropdownToggle"
              caret
              color="warning"
              id="navbarDropdownMenuLink2"
              type="button"
              disabled
            >
              Select audio quality
            </DropdownToggle>
          ) : (
            <div>
              <DropdownToggle
                className="dropdownToggle"
                caret
                color="warning"
                id="navbarDropdownMenuLink2"
                type="button"
              >
                {selectedOption}
              </DropdownToggle>

              <DropdownMenu
                aria-labelledby="navbarDropdownMenuLink2"
                className="dropdown_scroll"
              >
                {data?.map(
                  (val) =>
                    val.resolution === "audio only" && (
                      <li key={val.id} className="dropdown">
                        <DropdownItem
                          onClick={() =>
                            setid(val.code, val.extension, val.resolution)
                          }
                        >
                          <div className="quality_list">{val.extension}</div>
                        </DropdownItem>
                      </li>
                    )
                )}
              </DropdownMenu>
            </div>
          )}
        </UncontrolledDropdown>
        {loading && <Spinner color="secondary" />}
        <Button classes={chubbyStyles} onClick={download}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default AudioOnly;

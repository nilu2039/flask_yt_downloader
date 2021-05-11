import React, { useState } from "react";
import "./HomePage.css";
import { Spinner } from "reactstrap";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import Button from "@material-ui/core/Button";
import { useGradientBtnStyles } from "@mui-treasury/styles/button/gradient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import axios from "axios";
import { Typography } from "@material-ui/core";
require("dotenv").config();
const HomePage = ({ data, disabled, url }) => {
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

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:5000/v1/api/download`
      : `/v1/api/download`;
  const download = async () => {
    if (id) {
      console.log(id);
      setLoading(true);
      const { data } = await axios.post(baseUrl, {
        code: `${id}`,
        url: url,
      });
      console.log(data);
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
              Select video quality
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
                className="dropdown__scroll"
              >
                {data?.map(
                  (val) =>
                    val.resolution !== "audio only" && (
                      <li key={val.id} className="dropdown">
                        <DropdownItem
                          style={{ fontWeight: "bold" }}
                          onClick={() =>
                            setid(
                              val.code,
                              val.extension,
                              `${val.resolution} ${val.extension}`
                            )
                          }
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className="quality_list">
                              {val.note.split(",")[0]}
                            </div>
                            <div className="quality_list">{val.extension}</div>
                            <div>
                              {val.note.split(",")[4] && (
                                <VolumeOffIcon
                                  style={{
                                    marginLeft: "20px",
                                    color: "red",
                                  }}
                                />
                              )}
                            </div>
                          </div>
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

export default HomePage;

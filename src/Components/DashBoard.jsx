import * as React from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./Navbar/Navbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import offer_letter from "../image/offer_letter.png";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "./component.css";

import { useNavigate } from "react-router-dom";

function DrawerAppBar(props) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const generateOfferLetter = () => {
    if (localStorage.getItem("authtoken") !== null) {
      navigate("/intern");
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    const fetchAcceptedInterns = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/getuser",
          {
            headers: {
              "auth-token": localStorage.getItem("authtoken"),
              Authorization: "Bearer yourToken",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          if (data.data.role === "admin") {
            setAdmin(true);
          }
        } else {
          console.error("Error fetching user detail:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };

    fetchAcceptedInterns();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Box component="main" sx={{ p: 3 }} className="main">
          <Toolbar />
          <Typography className="text_offer_letter">
            <h1>Generate your offer letter online now</h1>
            <p>
              <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
              Attract the best candidates with a professional offer
            </p>
            <p>
              <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
              Use our recommended template or upload your own template
            </p>
            <p>
              <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
              Autofill the template with candidate Information
            </p>
            <p>
              <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
              Download offer letter pdf and send immediately
            </p>
            <Typography
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button onClick={generateOfferLetter}>
                Generate Offer_letter
              </Button>
              {admin && (
                <Link to="/internstatus">
                  <Button style={{ marginTop: "8px" }}>
                    View Internship Status
                  </Button>
                </Link>
              )}
            </Typography>
          </Typography>
          <img src={offer_letter} alt="" className="offer_letter" />
        </Box>
      </Box>
    </>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;

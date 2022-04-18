import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { styled } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "animate.css";
import DocumentMeta from "react-document-meta";

import {
  Container,
  Button,
  Input,
  Spacer,
  Text,
  Link,
} from "@nextui-org/react";

const SendIcon = ({
  fill = "currentColor",
  filled,
  size,
  height,
  width,
  label,
  className,
  ...props
}) => {
  return (
    <svg
      data-name="Iconly/Curved/Lock"
      xmlns="http://www.w3.org/2000/svg"
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <g transform="translate(2 2)">
        <path
          d="M19.435.582A1.933,1.933,0,0,0,17.5.079L1.408,4.76A1.919,1.919,0,0,0,.024,6.281a2.253,2.253,0,0,0,1,2.1L6.06,11.477a1.3,1.3,0,0,0,1.61-.193l5.763-5.8a.734.734,0,0,1,1.06,0,.763.763,0,0,1,0,1.067l-5.773,5.8a1.324,1.324,0,0,0-.193,1.619L11.6,19.054A1.91,1.91,0,0,0,13.263,20a2.078,2.078,0,0,0,.25-.01A1.95,1.95,0,0,0,15.144,18.6L19.916,2.525a1.964,1.964,0,0,0-.48-1.943"
          fill={fill}
        />
      </g>
    </svg>
  );
};

export const SendButton = styled("button", {
  // reset button styles
  "background-color": "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  // styles
  width: "24px",
  margin: "0 10px",
  dflex: "center",
  bg: "$primary",
  borderRadius: "$rounded",
  cursor: "pointer",
  transition: "opacity 0.25s ease 0s, transform 0.25s ease 0s",
  svg: {
    size: "100%",
    padding: "4px",
    transition: "transform 0.25s ease 0s, opacity 200ms ease-in-out 50ms",
    boxShadow: "0 5px 20px -5px rgba(0, 0, 0, 0.1)",
  },
  "&:hover": {
    opacity: 0.8,
  },
  "&:active": {
    transform: "scale(0.9)",
    svg: {
      transform: "translate(24px, -24px)",
      opacity: 0,
    },
  },
});

export default function Home() {
  const [value, setValue] = useState("");

  async function Request() {
    const response = await fetch("/api/threat", {
      method: "POST",
      body: JSON.stringify({ url: value }),
    });

    const response_parsed = await response.json();

    console.log(response_parsed);

    switch (response_parsed.status) {
      case "Safe":
        document.body.style = "background: green;";
        document.getElementById("title").style.color = "white";
        document.getElementById("disclaimer").style.color = "white";
        document.getElementById("info").innerHTML = "";
        break;
      case "Unsafe":
        document.body.style = "background: red;";
        document.getElementById("disclaimer").style.color = "white";
        document.getElementById("title").style.color = "white";
        document.getElementById("info").innerHTML = "";
        break;
      case "Invalid URL":
        document.body.style = "background: orange;";
        document.getElementById("title").style.color = "white";
        document.getElementById("disclaimer").style.color = "white";
        document.getElementById("info").innerHTML = "Invalid URL";
        break;
    }

    if (response_parsed.status == "Unsafe") {
      document.getElementById("reason").innerHTML =
        "Unsafe: " + response_parsed.threatType;
    } else if (response_parsed.status == "Safe") {
      document.getElementById("reason").innerHTML = "Safe";
    } else {
      document.getElementById("reason").innerHTML = "";
    }
  }

  async function checkAnswer(event) {
    if (event.key === "Enter") {
      Request();
    }
  }

  const meta = {
    title: "URL Checker",
    description:
      "This website allows you to check if a website is safe or not.",
    meta: {
      charset: "utf-8",
      name: {
        keywords:
          "malware, URL, scam, virus, threat, checker, check, safe, unsafe, safechecker, safe-checker",
      },
    },
  };

  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.getElementById("container").style.setProperty("--vh", `${vh}px`);
    window.addEventListener("resize", () => {
      let vh = window.innerHeight * 0.01;
      document.getElementById("container").style.setProperty("--vh", `${vh}px`);
    });
  }, []);

  return (
    <DocumentMeta {...meta}>
      <Container
        as="main"
        display="flex"
        direction="column"
        justify="center"
        alignItems="center"
        className={styles.container}
        id="container"
      >
        <Text
          h1
          className={`${styles.title} ${"animate__animated animate__bounceIn"}`}
          id="title"
        >
          URL Checker
        </Text>
        <Spacer />
        <Input
          aria-label="URL Input"
          value={value}
          aria-required="true"
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
          onKeyUp={(event) => {
            checkAnswer(event, value);
          }}
          size="xl"
          clearable
          contentRightStyling={false}
          placeholder="Type your URL..."
          contentRight={
            <SendButton onClick={Request} aria-label="URL Input Button">
              <SendIcon />
            </SendButton>
          }
        />
        <Spacer />
        <Text h2 className={`${styles.subtitle} `} id="info"></Text>
        <Spacer />
        <Text h2 className={`${styles.subtitle}`} id="reason"></Text>
        <div
          style={{ position: "absolute", bottom: "0px", textAlign: "center" }}
        >
          <p className={`${styles.disclaimer} `} id="disclaimer">
            None of the authors, contributors, administrators, vandals, or
            anyone else connected with URL Checker, in any way whatsoever, can
            be responsible for your use of the information contained in or
            linked from this web page.
          </p>
        </div>
      </Container>
    </DocumentMeta>

  );
}

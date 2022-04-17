// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

const reg = new RegExp("^http[s]?://(www.)?(.*)?/?(.)*");
const Token = process.env.TOKEN;

export default function handler(req, res) {
  const parsedUrl = JSON.parse(req.body).url;
  if (reg.test(parsedUrl.toLowerCase())){
    const json = {
      threatInfo: {
        threatTypes: [
          "THREAT_TYPE_UNSPECIFIED",
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["PLATFORM_TYPE_UNSPECIFIED", "ANY_PLATFORM"],
        threatEntryTypes: [
          "THREAT_ENTRY_TYPE_UNSPECIFIED",
          "URL",
          "EXECUTABLE",
        ],
        threatEntries: [{ url: (parsedUrl.toLowerCase()).match(reg)[2] }],
      },
    };

    const options = {
      method: "post",
      url: `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${TOKEN}`,
      data: json,
    };

    // send the request
    axios(options).then((response) => {
      if (response.data.matches != undefined) {
        let threatType = response.data.matches[0].threatType;
        let threatEntryType = response.data.matches[0].threatEntryType;

        switch (threatType) {
          case "THREAT_TYPE_UNSPECIFIED":
            threatType = "Unspecified";
            break;
          case "MALWARE":
            threatType = "Malware";
            break;
          case "SOCIAL_ENGINEERING":
            threatType = "Social Engineering";
            break;
          case "UNWANTED_SOFTWARE":
            threatType = "Unwanted Software";
            break;
          case "POTENTIALLY_HARMFUL_APPLICATION":
            threatType = "Potentially Harmful Application";
            break;
        }
        switch (threatEntryType) {
          case "THREAT_ENTRY_TYPE_UNSPECIFIED":
            threatEntryType = "Unspecified";
            break;
          case "URL":
            threatEntryType = "URL";
            break;
          case "EXECUTABLE":
            threatEntryType = "Executable";
            break;
        }

        res.status(200).json({
          status: "Unsafe",
          threatType: threatType,
          threatEntryType: threatEntryType,
        });
      } else {
        res.status(200).json({ status: "Safe" });
      }
    });
  } else {
    res.status(200).json({ status: "Invalid URL" });
  }
}

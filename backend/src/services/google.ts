import axios from "axios";
import { Volume } from "../models/google-volumes";
import { GoogleList } from "../models/google-list";

const googleUrl = process.env.GOOGLE_BOOKS_URL || "";

export const scrapeBookByIsbn = async (isbn: string) => {
  return await axios.get<GoogleList<Volume>>(
    `${googleUrl}/volumes`,
    {
      params: {
        q: `isbn:${isbn}`,
        orderBy: "relevance",
      },
    }
  );
};

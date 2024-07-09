import axios from "axios";
import { Volume } from "../models/google-volumes";
import { GoogleList } from "../models/google-list";
import { Service } from "typedi";
import { config } from "../config";

@Service()
export default class GoogleService {
  googleUrl = config.googleUrl || "";

  public async scrapeBookByIsbn(isbn: string) {
    return await axios.get<GoogleList<Volume>>(`${this.googleUrl}/volumes`, {
      params: {
        q: `isbn:${isbn}`,
        orderBy: "relevance",
      },
    });
  }
}

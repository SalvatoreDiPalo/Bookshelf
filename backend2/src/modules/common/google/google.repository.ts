import { GoogleList } from "@/libs/models/google-list";
import { Volume } from "@/libs/models/google-volumes";
import { env } from "@/libs/utils/envConfig";
import axios, { AxiosResponse } from "axios";

class GoogleRepository {
  async scrapeBook(
    isbn: string
  ): Promise<AxiosResponse<GoogleList<Volume>, any>> {
    return await axios.get<GoogleList<Volume>>(
      `${env.GOOGLE_BOOKS_URL}/volumes`,
      {
        params: {
          q: `isbn:${isbn}`,
          orderBy: "relevance",
        },
      }
    );
  }
}

export const googleRepositoryInstance = new GoogleRepository();

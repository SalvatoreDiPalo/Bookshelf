import { Request } from "express";
import { getBookByIsbn, scrapeBook } from "../services/book-service";

export const getBook = async (req: Request, res) => {
  const isbn = req.params.isbn;

  let book = await getBookByIsbn(isbn);
  if (book !== null) return res.json(book);

  await scrapeBook(isbn, res);

  book = await getBookByIsbn(isbn);

  res.json(book);
};

import { Inject, Service } from "typedi";
import { Author } from "../models/entity/Author";
import { In, Repository } from "typeorm";
import { ResultDTO } from "../models/dto/result-dto";
import { AuthorDTO } from "../models/dto/author-dto";

@Service()
export default class AuthorService {
  constructor(
    @Inject("AuthorRepository")
    private readonly authorRepository: Repository<Author>,
    @Inject("logger") private readonly logger
  ) {}

  public async getAuthors(ids: number[]): Promise<ResultDTO<AuthorDTO>> {
    let authors: [Author[], number] = await this.authorRepository.findAndCount({
      where: {
        id: In(ids),
      },
    });
    this.logger.debug("Founded %d authors", authors[1]);
    const resultDTO: ResultDTO<AuthorDTO> = {
      totalItems: authors[1],
      items: authors[0].map((author) => {
        return {
          id: author.id,
          name: author.name,
        };
      }),
    };

    return resultDTO;
  }
}

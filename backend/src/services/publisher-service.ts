import { Inject, Service } from "typedi";
import { In, Repository } from "typeorm";
import { ResultDTO } from "../models/dto/result-dto";
import { Publisher } from "../models/entity/Publisher";
import { PublisherDTO } from "../models/dto/publisher-dto";

@Service()
export default class PublisherService {
  constructor(
    @Inject("PublisherRepository")
    private readonly publisherRepository: Repository<Publisher>,
    @Inject("logger") private readonly logger
  ) {}

  public async getPublishers(ids: number[]): Promise<ResultDTO<PublisherDTO>> {
    let publishers: [Publisher[], number] =
      await this.publisherRepository.findAndCount({
        where: {
          id: In(ids),
        },
      });
    this.logger.debug("Founded %d publishers", publishers[1]);
    const resultDTO: ResultDTO<PublisherDTO> = {
      totalItems: publishers[1],
      items: publishers[0].map((publisher) => {
        return {
          id: publisher.id,
          name: publisher.name,
        };
      }),
    };

    return resultDTO;
  }
}

import { Op } from "sequelize";
import Event from "./entities/event.entity";
import Workshop from "./entities/workshop.entity";

export class EventsService {
  async getWarmupEvents() {
    return await Event.findAll();
  }

  async getEventsWithWorkshops() {
    return Event.findAll({ include: [Workshop] });
  }
  async getFutureEventWithWorkshops() {
    return Event.findAll({
      include: [
        {
          model: Workshop,
          where: { start: { [Op.gt]: new Date() } },
        },
      ],
    });
  }
}

import { DataTypes, literal, QueryInterface } from "sequelize";
import { ModelAttributes } from "sequelize/types/model";

export default {
  /**
  # ToDo: Create a migration that creates all tables for the following user stories

  For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
  To not introduce additional complexity, please consider only one cinema.

  Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

  ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times ✓
   * As a user I want to only see the shows which are not booked out ✓

   **Show administration**
   * As a cinema owner I want to run different films at different times ✓
   * As a cinema owner I want to run multiple films at the same time in different showrooms ✓

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I don't want to configure the seating for every show
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // name, email, ...
    } as ModelAttributes);

    await queryInterface.createTable("films", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING },
      // if this value is not null so film is watchable
      availableAt: {
        type: DataTypes.DATE,
        defaultValue: literal("CURRENT_TIMESTAMP"),
      },
    } as ModelAttributes);

    await queryInterface.createTable("shows", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      filmId: {
        type: DataTypes.STRING,
        references: {
          model: {
            tableName: "films",
          },
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: literal("CURRENT_TIMESTAMP"),
      },
      price: {
        type: DataTypes.INTEGER,
      },
      users: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      seats: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        references: {
          model: {
            tableName: "seats",
          },
          key: "id",
        },
      },
      // witch user booked witch seat
      // this is a json data object so we need ot stringify if
      booked: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("booked"));
        },
        set: function (value) {
          return this.setDataValue("booked", JSON.stringify(value));
        },
      },
      bookedOut: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      premiumPercentage: {
        type: DataTypes.INTEGER,
      },
      showroom: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        references: {
          model: {
            tableName: "showrooms",
          },
          key: "id",
        },
      },
    } as ModelAttributes);

    await queryInterface.createTable("seats", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        enum: ["usual", "couple", "premium"],
      },
      showroom: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        references: {
          model: {
            tableName: "showrooms",
          },
          key: "id",
        },
      },
    } as ModelAttributes);

    await queryInterface.createTable("showrooms", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    } as ModelAttributes);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: (queryInterface: QueryInterface) => {
    // do nothing
  },
};

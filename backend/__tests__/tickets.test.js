const database = require("../db/database.js");
const tickets = require("../models/tickets.js");

// Mock the database module
jest.mock("../db/database.js");

let mockFind;
let mockInsertOne;

beforeEach(() => {
  // Mock the MongoDB collection methods we'll use
  mockFind = jest.fn();
  mockInsertOne = jest.fn();

  database.openDb.mockResolvedValue({
    collection: jest.fn().mockReturnValue({
      find: mockFind,
      insertOne: mockInsertOne,
    }),
  });
});

describe("tickets", () => {
  describe("getTickets", () => {
    it("should return all tickets", async () => {
      const mockTickets = [
        { code: "A1", trainnumber: "123", traindate: "2023-01-01" },
      ];
      mockFind.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValueOnce(mockTickets),
        }),
      });

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await tickets.getTickets(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: mockTickets });
    });
  });

  describe("createTicket", () => {
    it("should create a ticket and return it", async () => {
      const mockTicket = {
        code: "B2",
        trainnumber: "456",
        traindate: "2023-02-02",
      };
      mockInsertOne.mockResolvedValueOnce({ insertedId: "mockId" });

      const req = {
        body: mockTicket,
      };
      const res = {
        json: jest.fn(),
      };

      await tickets.createTicket(req, res);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          id: "mockId",
          ...mockTicket,
        },
      });
    });
  });
});

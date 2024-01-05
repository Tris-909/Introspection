import { readError } from "../read";
import { readDocById } from "utils";
import { CollectionDatabaseNames } from "types";

jest.mock("utils", () => ({
  readDocById: jest.fn(),
}));

describe("Testing readError func", () => {
  test("Should have called readDocById with correct args", async () => {
    await readError("valid_uuid_v4");

    expect(readDocById).toHaveBeenCalledWith({
      collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
      id: "valid_uuid_v4",
    });
  });
});

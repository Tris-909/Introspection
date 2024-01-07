import { deleteError } from "../delete";
import { deleteDocById } from "utils";
import { CollectionDatabaseNames } from "types";

jest.mock("utils", () => ({
  deleteDocById: jest.fn(),
}));

describe("Testing deleteError func", () => {
  test("Should have called deleteDocById with correct args", async () => {
    await deleteError({
      id: "valid_uuid_v4",
    });

    expect(deleteDocById).toHaveBeenCalledWith({
      collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
      id: "valid_uuid_v4",
    });
  });
});

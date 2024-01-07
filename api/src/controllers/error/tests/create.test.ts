import { createError } from "../create";
import { createDoc } from "utils";
import { CollectionDatabaseNames } from "types";

jest.mock("utils", () => ({
  createDoc: jest.fn(),
}));
jest.mock("crypto", () => ({
  randomUUID: () => "random_id",
}));

describe("Testing createError func", () => {
  test("Should return errorEntity", async () => {
    const result = await createError({
      title: "TEST",
      description: "TEST",
      tags: ["TEST0"],
    });
    const expectedEntity = {
      id: "random_id",
      title: "TEST",
      description: "TEST",
      tags: ["TEST0"],
      createdAt: result.createdAt,
    };

    expect(createDoc).toHaveBeenCalledWith({
      collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
      data: expectedEntity,
    });
  });
});

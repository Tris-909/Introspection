import { patchError } from "../patch";
import { updateDocById } from "utils";
import { CollectionDatabaseNames } from "types";

jest.mock("utils", () => ({
  updateDocById: jest.fn().mockResolvedValue({
    id: "a_valid_uuidv4",
    title: "new_title",
    description: "TEST",
    tags: ["TEST0"],
    createdAt: 1704005774700,
  }),
}));

describe("Testing patchError func", () => {
  const mockedUpdatedErrorItem = {
    id: "a_valid_uuidv4",
    title: "new_title",
    description: "TEST",
    tags: ["TEST0"],
    createdAt: 1704005774700,
  };

  test("Should return updated errorEntity", async () => {
    const pathErrorArg = {
      id: "a_valid_uuidv4",
      data: {
        title: "new_title",
      },
    };
    const result = await patchError(pathErrorArg);

    expect(updateDocById).toHaveBeenCalledWith({
      collectionName: CollectionDatabaseNames.ERROR_COLLECTION,
      id: pathErrorArg.id,
      data: pathErrorArg.data,
    });
    expect(result).toEqual(mockedUpdatedErrorItem);
  });
});

import { test } from "./utils/fixtures";
import { expect } from "./utils/custom-expect";
import { getNewRandomUser } from "./utils/data-generator";

const cases = [
  {
    username: "a",
    expectedErrorMessage: "is too short (minimum is 3 characters)",
  },
  {
    username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    expectedErrorMessage: "is too long (maximum is 20 characters)",
  },
];

test.describe("User API | registration negative cases (invalid username → 422)", () => {
  for (const { username, expectedErrorMessage } of cases) {
    test(`should return 422 and username error when username is "${username}"`, async ({ api }) => {
      const userRequest = getNewRandomUser();
      userRequest.user.username = username;

      const newUserResponse = await api
        .path("/users")
        .body(userRequest)
        .postRequest(422);

      await expect(newUserResponse).shouldMatchSchema(
        "users",
        "POST_user_negative_schema",
        false,
      );
      const usernameErrors = newUserResponse.errors?.username ?? [];
      expect(usernameErrors[0]).shouldBe(expectedErrorMessage);
    });
  }
});

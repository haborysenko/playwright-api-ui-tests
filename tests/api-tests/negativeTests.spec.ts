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

for (const { username, expectedErrorMessage } of cases) {
  test(`should return 422 when username is ${username}`, async ({ api }) => {
    const userRequest = getNewRandomUser(); // valid faker email & password; we only vary username
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

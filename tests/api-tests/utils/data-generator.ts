import articleRequestPayloads from "../../../support/api/request-objects/POST_article.json";
import userRequestPayloads from "../../../support/api/request-objects/POST_user.json";
import { faker } from "@faker-js/faker";

export function getNewRandomArticle() {
  const articleRequest = structuredClone(articleRequestPayloads);
  articleRequest.article.title = faker.lorem.sentence(5);
  articleRequest.article.description = faker.lorem.sentence(10);
  articleRequest.article.body = faker.lorem.paragraph(8);
  return articleRequest;
}

export function getNewRandomUser() {
  const userRequest = structuredClone(userRequestPayloads);
  userRequest.user.email = faker.internet.email();
  userRequest.user.password = faker.internet.password();
  userRequest.user.username = faker.internet.username();
  return userRequest;
}

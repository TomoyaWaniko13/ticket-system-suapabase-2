// P.99 Implementing the login functionality in our app
// https://www.youtube.com/watch?v=VLk45JBe8L8

export type ActionResult = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

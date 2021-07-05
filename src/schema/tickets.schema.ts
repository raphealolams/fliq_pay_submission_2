import { object, string, mixed } from "yup";

const create = {
  body: object({
    title: string().required("Title is required"),
    description: string()
      .required("Description is required")
      .min(10, "Description is too short - should be 120 chars minimum."),
  }),
};

const update = {
  body: object({
    comment: string()
      .required("comment is required")
      .min(10, "Description is too short - should be 120 chars minimum."),
    ticketId: string().required("ticketId is required")
  }),
};

const params = {
  params: object({
    ticketId: string().required("ticketId is required"),
  }),
};

export const createTicketSchema = object({
  ...create,
});

export const commentSchema = object({
  ...params,
  ...update,
});

export const deletePostSchema = object({
  ...params,
});

export const getTicketSchema = object({
  ...params
})
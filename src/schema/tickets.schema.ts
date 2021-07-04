import { object, string, mixed } from "yup";

const create = {
  body: object({
    title: string().required("Title is required"),
    description: string()
      .required("Description is required")
      .min(100, "Body is too short - should be 120 chars minimum."),
  }),
};

const update = {
  body: object({
    title: string().required("Title is required"),
    description: string()
      .required("Description is required")
          .min(100, "Body is too short - should be 120 chars minimum."),
    status: mixed().oneOf(['open', 'closed'])
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

export const updateTicketSchema = object({
  ...params,
  ...update,
});

export const deletePostSchema = object({
  ...params,
});

export const getTicketSchema = object({
  ...params
})
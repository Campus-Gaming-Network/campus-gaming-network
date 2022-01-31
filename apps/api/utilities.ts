import { Request } from "express";

export const parseRequestQuery = (req: Request) => {
  const parsed: { [key: string]: any } = {};

  if (req.query.offset) {
    parsed.offset = Number(req.query.offset) || undefined;
  }

  if (req.query.limit) {
    parsed.limit = Number(req.query.limit) || undefined;
  }

  let attributes: string[] = [];

  if (req.query.attributes) {
    if (typeof req.query.attributes === "string") {
      req.query.attributes.split(",").forEach((field) => {
        attributes.push(field);
      });
    } else if (Array.isArray(req.query.attributes)) {
      attributes = req.query.attributes.map((field) => String(field));
    }
  }

  if (attributes.length) {
    parsed.attributes = attributes;
  }

  return parsed;
};

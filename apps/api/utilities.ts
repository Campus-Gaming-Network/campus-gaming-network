import { Request } from "express";

interface ParsedRequestQuery {
  offset?: number;
  limit?: number;
  attributes?: string[];
}

export const parseRequestQuery = (req: Request): ParsedRequestQuery => {
  let parsed = {};

  if (req.query.offset) {
    const offset = Number(req.query.offset) || undefined;

    if (offset) {
      parsed = { ...parsed, offset };
    }
  }

  if (req.query.limit) {
    const limit = Number(req.query.limit) || undefined;

    if (limit) {
      parsed = { ...parsed, limit };
    }
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
    parsed = { ...parsed, attributes };
  }

  return parsed;
};

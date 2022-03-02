import e, { Request } from "express";
import { customAlphabet } from "nanoid";
import * as bcrypt from "bcrypt";
import {
  NANO_ALPHABET,
  NANO_ID_LENGTH,
  SALT_ROUNDS,
  BASE_OFFSET,
  BASE_LIMIT,
} from "./constants";

interface ParsedRequestQuery {
  offset: number;
  limit: number;
  attributes?: string[];
  // order?: [string] | [string, string];
  order?: any;
}

export const parseRequestQuery = (req: Request): ParsedRequestQuery => {
  let parsed: ParsedRequestQuery = {
    offset: BASE_OFFSET,
    limit: BASE_LIMIT,
  };

  if (req.query.offset) {
    parsed = { ...parsed, offset: Number(req.query.offset) || BASE_OFFSET };
  }

  if (req.query.limit) {
    parsed = { ...parsed, limit: Number(req.query.limit) || BASE_LIMIT };
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

  if (req.query.order) {
    let order: string[] = [];

    if (!Array.isArray(req.query.order)) {
      order = [String(req.query.order)];
    }

    parsed = {
      ...parsed,
      order: order.map((o: string) => o.split(".")),
    };
  }

  return parsed;
};

export const buildPagination = (
  count: number,
  total: number,
  offset: number,
  limit: number
) => {
  const pages = Math.ceil(total / limit);
  const page = offset ? offset / limit + 1 : 1;
  const isFirstPage = page === 1;
  const isLastPage = page === pages;

  return {
    count,
    total,
    offset,
    limit,
    pages,
    page,
    isFirstPage,
    isLastPage,
  };
};

// Returns a callable function
export const nanoid = customAlphabet(NANO_ALPHABET, NANO_ID_LENGTH);

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => await bcrypt.compare(password, hash);
